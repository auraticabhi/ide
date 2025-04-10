export type Language =
  | "python"
  | "javascript"
  | "typescript"
  | "cpp"
  | "php"
  | "rust"
  | "go"
  | "swift";

export type LanguageCode =
 | 0 
 | 1
 | 4
  | 71
  | 72
  | 74
  | 63
  | 2
  | 68

  export type ProjectData = {
    command_line_arguments : string;
    compiler_options : string;
    created_at : string,
    id : string,
    language_id : string;
    project_name : string;
    source_value : string;
    stdin_value : string;
    updated_at : string;
    user_id : string;
  }