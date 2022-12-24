import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {Bucket, UserData} from './DataTypes';

export function get_document(userId: string) {
  return firestore().collection('mber').doc(userId);
}

export async function duplicate_check(nick: string): Promise<boolean> {
  nick = nick.trim();
  const finding = await firestore()
    .collection('mber')
    .where('nickname', '==', nick)
    .limit(1)
    .get();

  return !finding.empty;
}

export async function get_nick_doc(
  nick: string,
): Promise<FirebaseFirestoreTypes.DocumentReference> {
  let doc: FirebaseFirestoreTypes.DocumentReference;
  nick = nick.trim();
  const finding = await firestore()
    .collection('mber')
    .where('nickname', '==', nick)
    .limit(1)
    .get();

  finding.forEach(s => {
    doc = s.ref;
  });

  // @ts-ignore
  return doc;
}

export async function add_star(
  userId: string,
  nickName: string,
): Promise<void> {
  const doc = get_document(userId);
  const data = (await doc.get()).data() as UserData;
  const stars = data.stars;

  await doc.update({
    stars: [nickName, ...stars],
  });
}

export async function del_star(userId: string, index: number): Promise<void> {
  const doc = get_document(userId);
  const data = (await doc.get()).data() as UserData;
  const stars = data.stars;

  await doc.update({
    stars: stars.filter((s, i) => i !== index),
  });
}

export async function is_join(userId: string): Promise<boolean> {
  const userIds: Array<string> = [];
  const collection = firestore().collection('mber');

  (await collection.get()).forEach(snapshat => userIds.push(snapshat.id));

  return userIds.includes(userId);
}

export async function set_default_info(
  userId: string,
  nick_name: string,
): Promise<void> {
  nick_name = nick_name.trim();

  await get_document(userId).set({
    nickname: nick_name,
    buckets: [],
    completed_buckets: [],
    stars: [],
  });
}

export async function set_nickname(
  userId: string,
  nick: string,
): Promise<void> {
  await get_document(userId).update({
    nickname: nick.trim(),
  });
}

export async function get_data(userId: string): Promise<UserData> {
  return (await get_document(userId).get()).data() as UserData;
}

export async function get_nick_name(userId: string): Promise<string> {
  return (await get_data(userId)).nickname;
}

export async function del_completed_bucket(
  userId: string,
  index: number,
): Promise<void> {
  const doc = get_document(userId);
  const data = (await doc.get()).data() as UserData;
  const completed_buckets = data.completed_buckets;

  await doc.update({
    completed_buckets: completed_buckets.filter((s, i) => i !== index),
  });
}

export async function complete_bucket(
  userId: string,
  index: number,
): Promise<void> {
  const doc = get_document(userId);
  const data = (await doc.get()).data() as UserData;
  const buckets = data.buckets;
  const date = new Date();

  await doc.update({
    buckets: buckets.filter((s, i) => i !== index),
    completed_buckets: [
      ...data.completed_buckets,
      {
        ...buckets[index],
        complete_date:
          date.getFullYear() +
          '. ' +
          (date.getMonth() + 1) +
          '. ' +
          date.getDate(),
      },
    ],
  });
}

export async function del_bucket(userId: string, index: number): Promise<void> {
  const doc = get_document(userId);
  const data = (await doc.get()).data() as UserData;
  const buckets = data.buckets;
  await doc.update({
    buckets: buckets.filter((s, i) => i !== index),
  });
}

export async function cancel_complete_bucket(
  userId: string,
  index: number,
): Promise<void> {
  const doc = get_document(userId);
  const data = (await doc.get()).data() as UserData;
  const completed_buckets = data.completed_buckets;
  const buckets = data.buckets;
  const complete_bucket = completed_buckets[index];
  delete completed_buckets[index].complete_date;

  await doc.update({
    buckets: [...buckets, complete_bucket],
    completed_buckets: completed_buckets.filter((s, i) => i !== index),
  });
}

export async function del_data(userId: string): Promise<void> {
  await get_document(userId).delete();
}

export async function add_bucket(
  userId: string,
  title: string,
  date: string,
  res: string,
) {
  const doc = get_document(userId);
  // @ts-ignore
  const buckets = (await doc.get()).data().buckets;
  await doc.update({
    buckets: [
      ...buckets,
      {title: title.trim(), date: date, res: res.trim(), like: []},
    ],
  });
}

export async function edit_bucket(
  userId: string,
  title: string,
  date: string,
  res: string,
  index: number,
) {
  const doc = get_document(userId);
  // @ts-ignore
  const buckets = (await doc.get()).data().buckets;
  const editData: Bucket = {
    title: title,
    date: date,
    res: res,
    like: buckets[index].like,
  };
  doc.update({
    // @ts-ignore
    buckets: buckets.map((s, i) => {
      if (i === index) {
        return editData;
      } else {
        return s;
      }
    }),
  });
}
