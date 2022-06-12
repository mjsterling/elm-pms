import { BookingSchema } from 'src/Booking';
import { RoomSchema } from 'src/Room';
import { RoomTypeSchema } from 'src/RoomType';

export const EmbeddedSchemas = {};
export const Schemas = { BookingSchema, RoomSchema, RoomTypeSchema };

export const baseSchema = {
  _id: 'objectId',
  _partition: 'string',
  createdAt: 'date',
  updatedAt: 'date',
} as const;
