import Project from '../models/Project.js';
import { generateCrudRouter } from '../utils/generateCrudRouter.js';

export default generateCrudRouter(Project);
