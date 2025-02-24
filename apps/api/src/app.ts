import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
  Application,
} from 'express';
import cors from 'cors';
import { PORT, WEB_URL } from './config';
import { SampleRouter } from './routers/sample.router';
import { TestingRouter } from './routers/testing.router';
import { AccountRouter } from './routers/account.router';
import { SubsRouter } from './routers/subs.router';
import { PaymentRouter } from './routers/payment.router';
import { SkillRouter } from './routers/skill.router';
import { EduRouter } from './routers/education.router';
import { JobRouter } from './routers/job.router';
import { ApplicantRouter } from './routers/applicant.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(
      cors({
        origin: WEB_URL || 'http//localhost:3000',
        credentials: true,
      }),
    );
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          // console.error('Error : ', err.stack);
          if (err.message !== null) {
            return res.status(400).send({ message: err.message });
          }
          return res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    const sampleRouter = new SampleRouter();
    const testingRouter = new TestingRouter();
    const accountRouter = new AccountRouter();
    const subsRouter = new SubsRouter();
    const paymentRouter = new PaymentRouter();
    const skillRouter = new SkillRouter();
    const eduRouter = new EduRouter();
    const jobRouter = new JobRouter();
    const applicantRouter = new ApplicantRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });

    this.app.use('/api/samples', sampleRouter.getRouter());

    this.app.use('/api/testing', testingRouter.getRouter());

    this.app.use('/api/account', accountRouter.getRouter());
    this.app.use('/api/subscription', subsRouter.getRouter());
    this.app.use('/api/payment', paymentRouter.getRouter());
    this.app.use('/api/skill', skillRouter.getRouter());
    this.app.use('/api/education', eduRouter.getRouter());
    this.app.use('/api/jobs', jobRouter.getRouter());
    this.app.use('/api/applicants', applicantRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}

// My Code
// export default function App {
//   const app: Application =  express()

//   app.use(
//     cors({origin: WEB_URL || 'http://localhost:3000', credentials: true})
//   )
// }
