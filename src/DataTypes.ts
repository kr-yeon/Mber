export interface UserData {
  nickname: string;
  buckets: Array<Bucket>;
  completed_buckets: Array<CompleteBucket>;
  stars: Array<string>;
}

export interface Bucket {
  title: string;
  res: string;
  date: string;
  like: Array<string>;
}

export interface CompleteBucket extends Bucket {
  complete_date: string;
}
