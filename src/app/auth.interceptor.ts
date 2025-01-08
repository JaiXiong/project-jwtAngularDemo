import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtToken = getJwtToken();
  if (jwtToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`
      }
    });
  }
  return next(req);
};

function getJwtToken() {
  return localStorage.getItem('JWT_TOKEN');
}
