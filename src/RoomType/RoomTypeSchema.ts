export const RoomTypeSchema = {
  name: 'RoomType',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    _partition: 'string',
    createdAt: 'date',
    updatedAt: 'date',
    beds_double: 'int',
    beds_queen: 'int',
    beds_king: 'int',
    beds_single: 'int',
    capacity: 'int',
    description: 'string?',
    name: 'string',
    price_peak: 'double',
    price_offpeak: 'double',
    rooms: {
      type: 'linkingObjects',
      objectType: 'Room',
      property: 'roomType',
    },
  },
} as const;
