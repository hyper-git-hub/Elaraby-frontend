// Created by soban on 08-08-2017.
import {Observer} from 'rxjs/Observer';
import {AppConfig} from '../../app.config';
import {AuthService} from "../services/auth.service";
import {AppLoader} from '../utils/app-loader';

/**
 * This interceptor is called on every http request. It extends the default Angular http structure.
 * AppLoader returns a boolean value which can be used for loaders whenever there is a http requets pending.
 */
export abstract class HttpController<T> implements Observer<T> {
  private appLoader: AppLoader;

  constructor(protected context: any = null, appLoader?: AppLoader) {
    this.appLoader = appLoader;
    this.initialize();
  }

  private initialize(): void {
    if (this.appLoader) {
      this.appLoader.visibility = true; // show loader
    }

    // if (this.isError) {
    //   // hide error layout
    // }
  }

  next(t: T): void {
    if (AppConfig.DEBUG) {
      // console.log(t);
    }
    this.onNext(t);
    // console.log(t);
  }

  error(err: any): void {
    let errorMessage = 'There is some issue your request cannot be processed.'; // change to let
    // errorMessage = err.error.message;
    this.onError(errorMessage, err);

    if (this.appLoader) {
      this.appLoader.visibility = false; // hide loader
    }
  }

  complete(): void {
    if (this.appLoader) {
      this.appLoader.visibility = false; // hide loader
    }
    this.onComplete();
  }

  abstract onNext(t: T): void;

  abstract onError(errorMessage: string, err: any): void;

  abstract onComplete(): void;
}
