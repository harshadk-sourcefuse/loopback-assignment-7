import { BootMixin } from '@loopback/boot';
import { ApplicationConfig, BindingScope } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import { LoggerServiceImpl } from './components/logger/logger.service';
import { LogBinders } from './keys';
import { LoggerComponent } from './components/logger/logger.component';
import { HeaderInterceptorMiddleware } from './middlewares';

export { ApplicationConfig };

export class LoopbackAssignment7Application extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.bind(LogBinders.LOGGER).toClass(LoggerServiceImpl).inScope(BindingScope.SINGLETON);
    this.configure(LogBinders.LOGGER).to({ shouldLog: true })

    // Set up the custom sequence
    this.sequence(MySequence);

    this.middleware(HeaderInterceptorMiddleware);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(LoggerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
