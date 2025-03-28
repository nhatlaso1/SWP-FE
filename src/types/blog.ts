export interface Blogs {
  blogId: number;
  blogTitle: string;
  blogImage: string;
  createdDate: string;
  status: boolean;
}


export interface BlogDetail {
  blogDetailId: number;
  blogDetailTitle: string;
  description: string;
  blogDetailImage: string;
}

export interface Blog {
  blogId: number;
  blogTitle: string;
  blogImage: string;
  createdDate: string;
  accountId: number;
  status: boolean;
  blogDetails: {
    $id: string;
    $values: BlogDetail[];
  };
}

export interface BlogPost {
  blogTitle: string;
  blogImage: string;
  status: boolean;
  blogDetails: BlogPostDetail[];
}

export interface BlogPostDetail {
  blogDetailTitle: string;
  description: string;
  blogDetailImage: string;
}


