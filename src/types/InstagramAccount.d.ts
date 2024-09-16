export interface InstagramAccount {
  media: Media;
  profile: Profile;
}

export interface Profile {
  biography: string;
  followers_count: number;
  follows_count: number;
  id: string;
  ig_id: number;
  media_count: number;
  name: string;
  profile_picture_url: string;
  username: string;
  website: string;
}

export interface Media {
  data: MediaItem[];
  paging: Paging;
}

export interface MediaItem {
  id: string;
  media_type: string;
  media_url?: string;
}

export interface Paging {
  cursors: Cursors;
}

export interface Cursors {
  after: string;
  before: string;
}
