import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from './members.service';
import { PrismaService } from '../prisma/prisma.service';
import { Member, MemberStatus, Role } from '@prisma/client';

describe('MembersService', () => {
  let service: MembersService;
  let prismaService: PrismaService;

  const member: Member = {
    id: 1,
    email: 'test1@example.com',
    nickname: 'test1',
    password: 'password1',
    birthdate: new Date(),
    status: MemberStatus.ACTIVE,
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  beforeEach(async () => {
    const prismaServiceMock = {
      member: {
        findMany: jest.fn().mockResolvedValue([member]),
        findUnique: jest.fn().mockResolvedValue(member),
        create: jest.fn().mockResolvedValue(member),
        update: jest.fn().mockResolvedValue(member),
        delete: jest.fn().mockResolvedValue(member),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all members', async () => {
    expect(await service.findAll()).toEqual([member]);
  });

  it('should find one member', async () => {
    expect(await service.findOne(1)).toEqual(member);
  });

  it('should create a member', async () => {
    expect(await service.create(member)).toEqual(member);
  });

  it('should update a member', async () => {
    expect(await service.update(1, member)).toEqual(member);
  });

  it('should remove a member', async () => {
    expect(await service.remove(1)).toEqual(member);
  });
});
