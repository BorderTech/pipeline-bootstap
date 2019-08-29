import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class JiraService {
  constructor(private readonly httpService: HttpService) {
    // console.log(httpService);
  }
  getMyPermissions() {
    return this.httpService
      .get('/mypermissions')
      .pipe(map(response => response.data));
  }
}
