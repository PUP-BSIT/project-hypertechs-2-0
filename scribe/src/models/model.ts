export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  lastname: string;
  firstname: string;
  email: string;
  password: string;
}

export interface FeaturedTemplates {
  icon: string;
  title: string;
}

export interface TempNote {
  title: string;
  content: string;
  lastEdited: string;
}
