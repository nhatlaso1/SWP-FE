export interface Blog {
    blogId: number;
    blogTitle: string;
    blogImage: string;
    createdDate: string;
    status: boolean;
  }
  
  export interface BlogApiResponse {
    $id: string;
    $values: Blog[];
  }
  