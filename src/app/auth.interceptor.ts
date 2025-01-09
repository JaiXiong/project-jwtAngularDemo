import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Interceptor running');
  const jwtToken = getJwtToken();
  console.log('Token from storage:', jwtToken);

  if (jwtToken) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    console.log('Request headers:', cloned.headers.get('Authorization'));
    return next(cloned);
  }
  console.log('No token found, proceeding without auth');
  return next(req);
};

function getJwtToken() {
  const tokens = localStorage.getItem('JWT_TOKEN');
  if (!tokens) {
    return;
  }
  var token = JSON.parse(tokens).token;
  console.log('Retrieved token:', token);
  return token;
  //return localStorage.getItem('JWT_TOKEN');
}
