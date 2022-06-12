type I = import('src/_realm').I;
type Booking = I['Booking'];
type Room = I['Room'];
type RoomType = I['RoomType'];
type Dispatch<T> = import('react').Dispatch<T>;
type SetStateAction<T> = import('react').SetStateAction<T>;
type InverseRelation = import('src/_realm').InverseRelation;
type Interface<T> = import('src/_realm').Interface<T>;
type New<T> = import('src/_realm').New<T>;
type FindRelations<T> = import('src/_realm').FindRelations<T>;
type StripRelations<T> = import('src/_realm').StripRelations<T>;

type RootNavigatorParams = import('src/App').RootNavigatorParams;
type NavProp =
  import('@react-navigation/stack').StackNavigationProp<RootNavigatorParams>;
type StackScreenProps<
  RootNavigatorParams,
  B extends keyof RootNavigatorParams,
> = import('@react-navigation/stack').StackScreenProps<RootNavigatorParams, B>;
type ScreenProps<A extends keyof RootNavigatorParams> = StackScreenProps<
  RootNavigatorParams,
  A
>;
