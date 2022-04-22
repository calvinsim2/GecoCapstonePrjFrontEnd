export class BlogModel {
    BlogID!: number;
    Title!: string;
    Description!: string;
    Content!: string;
    BlogImg?: string;
    IsVisible!: boolean;
    PublishDate!: Date;
    UpdatedDate!: Date;
    UserID!: number;
}
  