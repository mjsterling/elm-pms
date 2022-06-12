import { BSON } from 'realm';
import { Schemas, EmbeddedSchemas } from 'src/_realm/schema';

/** Creates a dynamic interface from a Realm Schema object.
 * This interface assumes you're working with an existing database record.
 * To create a new record, e.g. for typing form fields,
 * use type `New<INameOfInterface>` to remove `_id`, `_group`, `createdAt`, `createdBy` fields
 */
type PropsOf<T extends Schema> = {
  [P in keyof T['properties']]: T['properties'][P];
};
export type Interface<O extends PropsOf<Schema>> = Join3<
  {
    -readonly [P in keyof O as O[P] extends
      | `${string}?`
      | `${string}[]`
      | InverseRelation
      ? never
      : P]: Map<O[P]>;
  },
  {
    -readonly [P in keyof O as O[P] extends `${string}?` ? P : never]?: Map<
      O[P]
    >;
  },
  {
    -readonly [P in keyof O as O[P] extends `${string}[]` | InverseRelation
      ? P
      : never]: Array<Map<O[P]>>;
  }
>;

type Join3<A, B, C> = { [P in keyof (A & B & C)]: (A & B & C)[P] };

export type I = {
  [P in keyof typeof Schemas as P extends `${infer CollectionName}Schema`
    ? CollectionName
    : never]: Interface<PropsOf<typeof Schemas[P]>>;
};
export type IEmbedded = {
  [P in keyof typeof EmbeddedSchemas as P extends `${infer CollectionName}Schema`
    ? CollectionName
    : never]: Interface<PropsOf<typeof EmbeddedSchemas[P]>>;
};
export type InverseRelation = {
  type: string;
  objectType: keyof I;
  property: string;
};
type TypeMap = Extend<
  {
    bool: boolean;
    date: Date;
    double: number;
    int: number;
    objectId: string;
    string: string;
  } & IEmbedded &
    I
> &
  InverseRelation;
export type New<T> = Omit<T, '_id' | '_partition' | 'createdAt' | 'updatedAt'>;
export type Errors<T> = {
  [P in keyof T]?: boolean;
};
type Extend<T> = T &
  {
    [P in Extract<keyof T, string> as `${P}?`]: T[P];
  } &
  {
    [P in Extract<keyof T, string> as `${P}[]`]: T[P];
  };

type Map<T extends keyof TypeMap | InverseRelation> =
  TypeMap[T extends InverseRelation ? T['objectType'] : T];

export type Schema = {
  name: string;
  primaryKey?: string;
  embedded?: boolean;
  properties: {
    [key: string]: keyof TypeMap | InverseRelation;
  };
};
export type FindRelations<X> = {
  [P in keyof X as X[P] extends Interface<any>[] ? P : never]: X[P];
};
export type StripRelations<X> = {
  [P in keyof X as X[P] extends Interface<any>[] ? never : P]: P;
};
