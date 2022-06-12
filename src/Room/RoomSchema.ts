export const RoomSchema = {
  name: 'Room',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    _partition: 'string',
    bookings: {
      type: 'linkingObjects',
      objectType: 'Booking',
      property: 'room',
    },
    createdAt: 'date',
    updatedAt: 'date',
    number: 'int',
    petsAllowed: 'bool',
    roomType: 'RoomType',
    wheelchairAccessible: 'bool',
  },
} as const;
