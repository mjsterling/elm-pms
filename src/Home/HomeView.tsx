import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Styles } from 'src/Styles';
import { Container } from 'src/components/Container';
import {
  Badge,
  Button,
  IconButton,
  List,
  Subheading,
  Text,
} from 'react-native-paper';
import { useCollection } from 'src/_realm';
import {
  LineSegment,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
} from 'victory-native';

Icon.loadFont(); // load FontAwesome font

export function HomeView({ navigation }: ScreenProps<'Home'>) {
  const Booking = useCollection('Booking');
  const Room = useCollection('Room');
  const [date, setDate] = useState(new Date());
  const unassignedBookings = Booking.all.filter(booking => !booking.room);
  const DataDisplay = ({
    k,
    v,
    width = '50%',
  }: {
    k: string;
    v: any;
    width?: string | number;
  }) => (
    <View style={[Styles.FRBC, { width, padding: 5 }]}>
      <Text style={{ fontWeight: 'bold' }}>{k}:</Text>
      <Text>{String(v)}</Text>
    </View>
  );
  const UnassignedBookings = () => {
    const [expandedId, setExpandedId] = useState<string | number>('');
    const [accordions, setAccordions] = useState(false);
    const toggleAccordions = () => {
      setAccordions(prev => !prev);
    };
    const onAccordionPress = (id: string | number) => {
      setExpandedId(prev => (prev === id ? '' : id));
    };

    const assignBookingToRoom = (booking: string, room: Room) => {
      Booking.update(booking, {
        room,
      });
    };
    const [selectedRooms, setSelectedRooms] = useState<
      { booking: Booking; rooms: number[] }[]
    >(unassignedBookings.map(booking => ({ booking, rooms: [] })));
    return unassignedBookings.length > 0 ? (
      <>
        <View style={[Styles.FRBC, { width: '100%', paddingHorizontal: 15 }]}>
          <View style={[Styles.FRCC, { width: '50%' }]}>
            <Subheading>Unassigned Bookings</Subheading>
            <Badge
              style={{ backgroundColor: '#f00', marginLeft: 3, fontSize: 14 }}>
              {unassignedBookings.length}
            </Badge>
          </View>
          <IconButton
            onPress={toggleAccordions}
            icon={accordions ? 'minus' : 'plus'}
          />
        </View>
        {accordions ? (
          <List.AccordionGroup {...{ expandedId, onAccordionPress }}>
            {unassignedBookings.map((booking, i) => {
              const availRooms = Room.all.filter(room =>
                room.bookings.filter(
                  roomBooking =>
                    roomBooking.endDate.getTime() <
                      booking.startDate.getTime() ||
                    roomBooking.startDate.getTime() > booking.endDate.getTime(),
                ),
              );
              return (
                <List.Accordion
                  style={{ borderWidth: 1, borderColor: '#DDD' }}
                  id={`bkngAccord${i}`}
                  title={`${
                    booking.contactFirstName + ' ' + booking.contactLastName
                  }   |   ${booking.startDate.toLocaleDateString('en-AU', {
                    day: '2-digit',
                    month: 'numeric',
                  })} - ${booking.endDate.toLocaleDateString('en-AU', {
                    day: '2-digit',
                    month: 'numeric',
                  })}`}>
                  <View
                    style={[
                      Styles.FRCC,
                      {
                        backgroundColor: '#f7f7f7',
                        padding: 10,
                        flexWrap: 'wrap',
                        borderWidth: 1,
                        borderTopWidth: 0,
                        borderColor: '#DDD',
                      },
                    ]}>
                    <DataDisplay k="Adults" v={booking.numAdults} />
                    <DataDisplay k="Children" v={booking.numChildren} />
                    <DataDisplay k="Pets" v={booking.pets ? 'Yes' : 'No'} />
                    <DataDisplay k="Pet Desc." v={booking.petDesc || 'N/A'} />
                    <DataDisplay k="Phone" v={booking.contactPhone} />
                    <DataDisplay k="Email" v={booking.contactEmail} />
                    <Subheading style={{ padding: 5 }}>
                      Assign To Rooms
                    </Subheading>
                    <View
                      style={[
                        Styles.FRCC,
                        { width: '100%', flexWrap: 'wrap' },
                      ]}>
                      {availRooms.map(room => (
                        <Button
                          mode="contained"
                          color={
                            selectedRooms
                              .find(
                                _booking =>
                                  `${_booking.booking}` === `${booking._id}`,
                              )
                              ?.rooms.includes(room.number)
                              ? 'green'
                              : undefined
                          }
                          style={{
                            borderRadius: 100,
                            margin: 2,
                          }}
                          onPress={() =>
                            assignBookingToRoom(booking._id, room)
                          }>
                          {room.number}
                        </Button>
                      ))}
                    </View>
                    <Button
                      mode="outlined"
                      color="red"
                      icon="delete"
                      onPress={() => Booking.destroy(booking._id)}
                      style={{ marginTop: 20 }}>
                      Decline Booking
                    </Button>
                  </View>
                </List.Accordion>
              );
            })}
          </List.AccordionGroup>
        ) : null}
      </>
    ) : null;
  };
  console.log(unassignedBookings);

  let temp: number;
  const bookingData = Room.all
    .map((room, i) =>
      room.bookings.map(booking => ({
        x: i + 1,
        y:
          (temp =
            Math.floor(
              (booking.startDate.getTime() - date.getTime()) / 86.4e6,
            ) + 2) < 0.5
            ? 0.5
            : temp > 7.5
            ? 7.5
            : temp + 0.1,
        y0:
          (temp =
            Math.floor((booking.endDate.getTime() - date.getTime()) / 86.4e6) +
            2) < 0.5
            ? 0.5
            : temp > 7.5
            ? 7.5
            : temp - 0.1,

        label: `${booking.contactLastName}`,
        index: i,
        booking,
      })),
    )
    .flat();
  const [bookingPopup, setBookingPopup] = useState<{
    booking: Booking | null;
    x: number;
    y: number;
  }>({
    booking: null,
    x: 0,
    y: 0,
  });

  const BookingPopup = () =>
    bookingPopup.booking ? (
      <View
        style={{
          zIndex: 100,
          padding: 5,
          backgroundColor: 'white',
          borderWidth: 2,
          borderRadius: 5,
          position: 'absolute',
          left: bookingPopup.x,
          top: bookingPopup.y,
        }}>
        <View
          style={[Styles.FRBC, { width: 150, marginBottom: 15, padding: 5 }]}>
          <Subheading>
            {bookingPopup.booking.contactFirstName +
              ' ' +
              bookingPopup.booking.contactLastName}
          </Subheading>
          <View style={[Styles.FRCC, { width: '25%' }]}>
            <IconButton
              size={16}
              icon="pencil"
              onPress={() => {
                Room.close();
                Booking.close();
                navigation.navigate('New Booking', {
                  _id: bookingPopup.booking?._id || '',
                });
              }}
              style={{ margin: 0, padding: 0 }}
            />
            <IconButton
              size={16}
              icon="close"
              onPress={() => setBookingPopup({ booking: null, x: 0, y: 0 })}
              style={{ margin: 0, padding: 0 }}
            />
          </View>
        </View>
        <DataDisplay
          width={150}
          k="Adults"
          v={bookingPopup.booking.numAdults}
        />
        <DataDisplay
          width={150}
          k="Children"
          v={bookingPopup.booking.numChildren}
        />
        <DataDisplay
          width={150}
          k="Pets"
          v={bookingPopup.booking.pets ? 'Yes' : 'No'}
        />
        <DataDisplay
          width={150}
          k="Pet Desc."
          v={bookingPopup.booking.petDesc || 'N/A'}
        />
        <DataDisplay
          width={150}
          k="Phone"
          v={bookingPopup.booking.contactPhone}
        />
        <DataDisplay
          width={150}
          k="Email"
          v={bookingPopup.booking.contactEmail}
        />
      </View>
    ) : null;

  const CalendarView = () => {
    const dateValues: string[] = [];
    let _date = new Date(date);
    for (let i = 0; i < 7; i++) {
      dateValues.push(
        _date.toLocaleDateString('en-AU', { day: 'numeric', month: 'numeric' }),
      );
      _date = new Date(_date.getTime() + 86.4e6);
    }

    return Room.all.length ? (
      <VictoryChart height={Room.all.length * 100} width={420}>
        <VictoryBar
          data={bookingData}
          horizontal
          cornerRadius={{ top: 3, bottom: 3 }}
          domain={{ x: [0.5, Room.all.length + 0.5], y: [0.5, 7.5] }}
          barRatio={1.3}
          style={{ data: { fill: 'purple' } }}
          labelComponent={
            <VictoryLabel
              text={({ datum }) =>
                datum.y > 0.5 && datum.y < 7.5 ? datum.label : ''
              }
              style={{ fill: 'white', fontSize: 11, padding: 0 }}
            />
          }
          events={[
            {
              target: 'data',
              eventHandlers: {
                onPress: e => {
                  return [
                    {
                      mutation: props =>
                        setBookingPopup({
                          booking: props.datum.booking,
                          x: Math.min(
                            //@ts-expect-error
                            e.nativeEvent.locationX,
                            Dimensions.get('window').width - 190,
                          ),
                          //@ts-expect-error
                          y: e.nativeEvent.locationY,
                        }),
                    },
                  ];
                },
              },
            },
          ]}
        />
        <VictoryAxis
          invertAxis
          gridComponent={<LineSegment />}
          orientation="left"
          tickFormat={Room.asc('number').map(room => room.number)}
          style={{ tickLabels: { fontSize: 18 } }}
        />
        <VictoryAxis orientation="right" tickFormat={() => ''} />
        <VictoryAxis dependentAxis orientation="top" tickFormat={dateValues} />
        <VictoryAxis dependentAxis tickFormat={() => ''} />
        {Room.asc('number').map((room, i) => (
          <VictoryAxis
            dependentAxis
            key={i}
            axisValue={i + 0.5}
            tickFormat={() => ''}
            label={room.roomType?.name}
            style={{
              axisLabel: {
                opacity: 0.1,
                fontSize: 18,
                padding: 14,
              },
            }}
            // style={{ axis: { stroke: 'red' } }}
          />
        ))}
      </VictoryChart>
    ) : (
      <View style={{ ...Styles.FCCC, flex: 1 }}>
        <List.Icon icon="loading" />
      </View>
    );
  };

  return (
    <Container
      header={
        <View style={Styles.FRBC}>
          <IconButton
            size={20}
            icon="chevron-triple-left"
            onPress={() => {
              setDate(oldDate => {
                const oldMonth = oldDate.getMonth();
                if (oldMonth === 0) {
                  oldDate.setMonth(11);
                } else {
                  oldDate.setMonth(oldMonth - 1);
                }
                return new Date(oldDate);
              });
            }}
          />
          <IconButton
            size={20}
            icon="chevron-double-left"
            onPress={() => {
              setDate(new Date(date.getTime() - 86.4e6 * 7));
            }}
          />
          <IconButton
            size={20}
            icon="chevron-left"
            onPress={() => {
              setDate(new Date(date.getTime() - 86.4e6));
            }}
          />
          <Subheading
            style={{
              fontSize: 18,
              width: 120,
              textAlign: 'center',
            }}>
            {date.toLocaleDateString(undefined, {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}
          </Subheading>
          <IconButton
            size={20}
            icon="chevron-right"
            onPress={() => {
              setDate(new Date(date.getTime() + 86.4e6));
            }}
          />
          <IconButton
            size={20}
            icon="chevron-double-right"
            onPress={() => {
              setDate(new Date(date.getTime() + 86.4e6 * 7));
            }}
          />
          <IconButton
            size={20}
            icon="chevron-triple-right"
            onPress={() => {
              setDate(oldDate => {
                const oldMonth = oldDate.getMonth();
                if (oldMonth === 11) {
                  oldDate.setMonth(0);
                } else {
                  oldDate.setMonth(oldMonth + 1);
                }
                return new Date(oldDate);
              });
            }}
          />
        </View>
      }
      body={
        <View style={{ height: '100%' }}>
          <ScrollView>
            <BookingPopup />
            <UnassignedBookings />
            <CalendarView />
          </ScrollView>
        </View>
      }
      footer={
        <Button
          mode="contained"
          icon="book-plus"
          onPress={() => navigation.navigate('New Booking')}>
          New Booking
        </Button>
      }
    />
  );
}

const Style = StyleSheet.create({
  bookingPopup: {
    ...Styles.FCCC,
    position: 'absolute',
    height: 300,
    width: 200,
  },
});
