import { useEffect, useState } from 'react';
import { BSON } from 'realm';
import { realmApp } from './RealmApp';
import { Schemas } from './schema';
import { generateJsonSchema } from './generateJsonSchema';
import { useNavigation } from '@react-navigation/native';

export function useCollection<T extends keyof I>(collection: T) {
  const [realm, setRealm] = useState<Realm | null>(null);
  const navigation = useNavigation();
  if (!realmApp.currentUser) throw 'NO ACTIVE USER';
  const config = {
    schema: Object.values(Schemas),
    sync: {
      user: realmApp.currentUser,
      partitionValue: realmApp.currentUser.id,
    },
  };
  const [state, setState] = useState<I[T][]>([]);
  const [busy, setBusy] = useState<boolean>(true);
  useEffect(() => {
    Realm.open(config)
      .then(newRealm => {
        setRealm(newRealm);
        let results: Realm.Results<I[T]> = newRealm.objects(collection);
        setState([...results]);
        results.addListener(() => {
          setState([...results]);
        });
        setBusy(false);
      })
      .catch(e => {
        console.error(
          `an error occurred opening the realm` + JSON.stringify(e),
        );
      });

    return close;
  }, []);

  function close() {
    setState([]);
    if (realm) {
      realm.close();
    }
    setRealm(null);
  }
  function create(datum: New<I[T]>) {
    if (!realm) {
      console.error('No realm instance');
      return;
    }
    console.log(datum);
    const newObject = {
      ...datum,
      _id: new BSON.ObjectId(),
      _partition: realmApp.currentUser?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    realm.write(() => {
      const _newObject = realm.create(collection, newObject);
    });

    navigation.goBack();
  }

  function destructure(realmObject: any) {
    const _realmObject: any = {};
    for (const key in realmObject) {
      _realmObject[key] = realmObject[key];
    }
    return _realmObject;
  }

  function destroy(_id: string) {
    if (!realm) {
      console.error('No realm instance');
      return;
    }
    const document = realm.objectForPrimaryKey(
      collection,
      new BSON.ObjectId(_id),
    );
    try {
      realm.write(() => {
        realm.delete(document);
      });
    } catch (e) {
      console.error(e);
    }
  }

  function find(_id: string): I[T] | undefined {
    if (!realm) {
      console.error('No realm instance');
      return;
    }
    let results: Realm.Results<I[T]> = realm.objects(collection);
    return results.find((obj: I[keyof I]) => `${obj._id}` === `${_id}`);
  }

  function generateSchema() {
    generateJsonSchema(
      Schemas[(collection + 'Schema') as keyof typeof Schemas],
    );
  }

  function update(_id: string, datum: Partial<I[T]>) {
    if (!realm) {
      console.error('No realm instance');
      return;
    }
    realm.write(() => {
      const objectToUpdate: { [key: string]: any } = realm.objectForPrimaryKey(
        collection,
        new BSON.ObjectID(_id),
      ) as I[T];
      if (objectToUpdate) {
        console.log('objectToUpdate', objectToUpdate);
        console.log('datum', datum);
        for (const key in datum) {
          if (['_id', '_partition', 'createdAt', 'updatedAt'].includes(key))
            continue;
          if (
            datum[key as keyof typeof datum] !== undefined &&
            objectToUpdate[key] !== datum[key as keyof typeof datum]
          ) {
            console.log(
              'changing',
              key,
              objectToUpdate[key],
              datum[key as keyof typeof datum],
            );
            objectToUpdate[key] = datum[key as keyof typeof datum];
          }
        }
        objectToUpdate.updatedAt = new Date();
      }
    });
    navigation.goBack();
  }

  function where(query: { [key: string]: any }) {
    if (realm) {
      let results: Realm.Results<I[T]> = realm.objects(collection);
      return results.filter(obj => {
        for (const key in query) {
          if (!obj.hasOwnProperty(key)) {
            console.warn(`Could not search ${collection} for ${key}`);
            return false;
          } else if (obj[key as keyof typeof obj] !== query[key]) {
            return false;
          }
        }
        return true;
      });
    } else {
      Realm.open(config)
        .then(newRealm => {
          setRealm(newRealm);
          let results: Realm.Results<I[T]> = newRealm.objects(collection);
          return results.filter(obj => {
            for (const key in query) {
              if (!obj.hasOwnProperty(key)) {
                console.warn(`Could not search ${collection} for ${key}`);
                break;
              } else if (obj[key as keyof typeof obj] !== query[key]) {
                return false;
              }
            }
            return true;
          });
        })
        .catch(e => {
          console.error(
            `an error occurred opening the realm ${JSON.stringify(e)}`,
          );
        });
    }
  }

  return {
    all: state,
    asc: (field: keyof I[T]) =>
      state.sort((a, b) => (a[field] < b[field] ? -1 : 1)),
    busy,
    create,
    close,
    desc: (field: keyof I[T]) =>
      state.sort((a, b) => (a[field] > b[field] ? -1 : 1)),
    destroy,
    find,
    generateSchema,
    update,
    where,
  };
}
