import { Plan, Reservation, File } from '@prisma/client';

export interface Sender {
  id: number;
  nickname: string;
  avatar?: string;
}

export interface Content {
  message: string;
  extra?: Extra;
}

export interface Message {
  id: number;
  sender: Sender;
  content: Content;
  createdAt: Date;
}

// Extra
export interface PhotoExtra {
  type: 'photo';
  data: string; // photoUrl
}

export interface FileExtra {
  type: 'file';
  data: File; // fileUrl
}

export interface ReservationExtra {
  type: 'reservation';
  data: Reservation;
}

export interface PlanExtra {
  type: 'plan';
  data: Plan;
}

export type Extra = PhotoExtra | FileExtra | ReservationExtra | PlanExtra;
