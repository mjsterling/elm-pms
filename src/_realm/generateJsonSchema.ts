import { EmbeddedSchemas, Schemas } from './schema';

/** Pass this a TS schema object and it'll console log the Realm JSON equivalent */
export const generateJsonSchema = (schema: Realm.ObjectSchema) => {
  const formattedSchema: FormattedSchema = {
    title: schema.name,
    primaryKey: schema.primaryKey || '_id',
    properties: {},
    required: [],
  };
  for (const key in schema.properties) {
    const [partial, required] = generatePartial(schema, key);
    formattedSchema.properties[key] = partial;
    if (required) formattedSchema.required.push(required);
  }
  console.log(JSON.stringify(formattedSchema));
};

function generatePartial(
  schema: Realm.ObjectSchema,
  key: string,
): [Partial, string | null] {
  const type = schema.properties[key];
  if (typeof type !== 'string') return [undefined, null];
  const isArray = /\[\]/.test(type);
  const isObject = /^[A-Z]/.test(type);
  const isRequired = !/\?$/.test(type);
  const fType = type.replace(/[\?\[\]]/g, '');

  if (isObject) {
    const objectSchema: ObjectPartial = {
      title: fType,
      bsonType: 'object',
      properties: {},
    };
    const schemaName = (fType + 'Schema') as keyof typeof EmbeddedSchemas;
    console.log(schemaName);
    const embeddedSchema = EmbeddedSchemas[schemaName];
    if (embeddedSchema !== undefined) {
      for (const key2 in embeddedSchema.properties) {
        const [partial] = generatePartial(embeddedSchema, key2);
        objectSchema.properties[key2] = partial;
      }
    } else {
      console.warn(type + ' Embedded Schema is not exported');
    }

    return [
      isArray ? { bsonType: 'array', items: objectSchema } : objectSchema,
      null,
    ];
  } else if (isArray) {
    return [
      {
        bsonType: 'array',
        items: {
          bsonType: fType,
        },
      },
      null,
    ];
  } else {
    return [
      {
        bsonType: fType,
      },
      isRequired ? key : null,
    ];
  }
}

type Partial = SimplePartial | ObjectPartial | ArrayPartial | undefined;

type FormattedSchema = {
  title: string;
  primaryKey: string;
  required: Array<string>;
  properties: {
    [key: string]: Partial;
  };
};

type SimplePartial = {
  bsonType: string;
  title?: string;
};

type ObjectPartial = {
  title: string;
  bsonType: 'object';
  properties: {
    [key: string]: Partial;
  };
};

type ArrayPartial = {
  bsonType: 'array';
  items: Partial;
};
