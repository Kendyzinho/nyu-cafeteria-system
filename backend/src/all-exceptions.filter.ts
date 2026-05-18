/**
 * FILTRO GLOBAL DE EXCEPCIONES (Modo Desarrollo)
 * 
 * ¿Para qué sirve?
 * Por defecto, NestJS oculta los detalles de los errores 500 (Internal Server Error)
 * por seguridad. Este filtro atrapa cualquier error interno no manejado en el backend 
 * (como bloqueos de la base de datos MySQL) y fuerza a que el servidor envíe el 
 * detalle exacto del problema al frontend a través de la variable `errorDetails`.
 * 
 * Esto ayuda enormemente a descubrir por qué está fallando una petición HTTP.
 * 
 * IMPORTANTE: Se recomienda deshabilitar o eliminar este archivo en el `main.ts` 
 * cuando la aplicación pase a etapa de Producción, para evitar exponer información 
 * sensible a los usuarios finales (hackers).
 */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    
    console.error('GLOBAL EXCEPTION:', exception);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception?.message || 'Internal server error',
      errorDetails: exception?.stack || String(exception),
    });
  }
}
