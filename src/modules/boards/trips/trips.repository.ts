import { BoardsRepositoryInterface } from 'src/interfaces/boards.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { Board, BoardType } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TagsRepository } from '../../tags/tags.repository';
import { CommentDto } from '../sos/dto/comment.dto';

@Injectable()
export class TripsRepository implements BoardsRepositoryInterface {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tagsRepository: TagsRepository,
  ) {}

  async create(createTripDto: CreateTripDto): Promise<Board> {
    const { tags, ...rest } = createTripDto;
    const tagIds = await this.tagsRepository
      .findOrCreateTags(tags)
      .then((tags) => tags.map((tag) => ({ tagId: tag.id })));

    return this.prisma.board.create({
      data: {
        ...rest,
        type: BoardType.TRIP,
        tags: {
          createMany: {
            data: tagIds,
          },
        },
      },
    });
  }

  findAll(): Promise<Board[]> {
    return this.prisma.board.findMany({
      where: { type: BoardType.TRIP },
      include: {
        author: {
          select: {
            avatar: true,
            nickname: true,
            gender: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: { name: true, id: true },
            },
          },
        },
        _count: {
          select: { likes: true },
        },
      },
    });
  }

  findPagination(
    cursor?: number,
    limit: number = 10,
    areas?: number[],
    sort?: string,
  ): Promise<Board[]> {
    return this.prisma.board.findMany({
      where: {
        type: BoardType.TRIP,
        ...(cursor && { id: { lt: cursor } }),
        ...(areas && areas.length > 0 && { areaId: { in: areas } }),
      },
      take: limit,
      orderBy: { id: 'desc' },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        author: true,
      },
    });
  }

  findOne(id: number): Promise<Board> {
    return this.prisma.board.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            avatar: true,
            nickname: true,
            gender: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: { name: true, id: true },
            },
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
        likes: {
          select: {
            memberId: true,
          },
        },
        comments: {
          include: {
            member: {
              select: {
                avatar: true,
                nickname: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: number, updateTripDto: UpdateTripDto): Promise<Board> {
    const { tags, ...rest } = updateTripDto;

    const tagIds = await this.tagsRepository
      .findOrCreateTags(tags)
      .then((tags) => tags.map((tag) => ({ tagId: tag.id })));

    return this.prisma.board.update({
      where: { id },
      data: {
        ...rest,
        tags: {
          deleteMany: {},
          createMany: {
            data: tagIds,
          },
        },
      },
    });
  }

  remove(id: number): Promise<Board> {
    return this.prisma.board.delete({ where: { id } });
  }

  async like(id: number, userId: number) {
    const existingLike = await this.prisma.boardLike.findUnique({
      where: {
        boardId_memberId: {
          boardId: id,
          memberId: userId,
        },
      },
    });

    if (existingLike) {
      await this.prisma.boardLike.delete({
        where: {
          boardId_memberId: {
            boardId: id,
            memberId: userId,
          },
        },
      });
      return;
    } else {
      return await this.prisma.boardLike.create({
        data: {
          boardId: id,
          memberId: userId,
        },
      });
    }
  }

  getComments(id: number) {
    return this.prisma.comment.findMany({
      where: { boardId: id },
      include: {
        member: {
          select: {
            avatar: true,
            nickname: true,
            id: true,
          },
        },
      },
    });
  }

  async comment(id: number, commentDto: CommentDto) {
    return this.prisma.comment.create({
      data: {
        content: commentDto.content,
        memberId: commentDto.memberId,
        boardId: id,
      },
    });
  }

  async removeComment(commentId: number) {
    return this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }

  async updateComment(commentId: number, content: string) {
    return this.prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: content,
      },
    });
  }
}
