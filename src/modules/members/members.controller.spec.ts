import { Test, TestingModule } from '@nestjs/testing';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { PrismaService } from '../prisma/prisma.service';
import { MembersModule } from './members.module';
import { PrismaModule } from '../prisma/prisma.module';

describe('MembersController', () => {
  let controller: MembersController;
  let service: MembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, MembersModule], // Import PrismaModule here
      providers: [MembersService, PrismaService],
      controllers: [MembersController], // Add MembersController here
    }).compile();

    service = module.get<MembersService>(MembersService);
    controller = module.get<MembersController>(MembersController); // Get the controller instance here
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a member', async () => {
    const dto = new CreateMemberDto();
    jest.spyOn(service, 'create').mockResolvedValueOnce(dto as any);
    expect(await controller.create(dto)).toBe(dto);
  });

  it('should find all members', async () => {
    const result = [new CreateMemberDto()];
    jest.spyOn(service, 'findAll').mockResolvedValueOnce(result as any);
    expect(await controller.findAll()).toBe(result);
  });

  it('should find one member', async () => {
    const result = new CreateMemberDto();
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(result as any);
    expect(await controller.findOne('1')).toBe(result);
  });

  it('should update a member', async () => {
    const dto = new UpdateMemberDto();
    jest.spyOn(service, 'update').mockResolvedValueOnce(dto as any);
    expect(await controller.update('1', dto)).toBe(dto);
  });

  it('should remove a member', async () => {
    const result = { deleted: true };
    jest.spyOn(service, 'remove').mockResolvedValueOnce(result as any);
    expect(await controller.remove('1')).toBe(result);
  });
});
