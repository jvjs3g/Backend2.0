import { getRepository } from 'typeorm';

import Category from '../models/Category';


class CreateCategoryService {

  public async execute(title: string): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const foundCategory = await categoryRepository.findOne({
        where: {title}
    });
      
    if (foundCategory) {
        return foundCategory;
    }

    const newCategory = categoryRepository.create({title});
    await categoryRepository.save(newCategory);

    return newCategory;

  }

}

export default CreateCategoryService;
