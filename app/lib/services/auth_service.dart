import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AuthService {
  Dio? _dio;
  final String _apiUrl = dotenv.env['API_URL']!;

  AuthService() {
    BaseOptions options = BaseOptions();

    options.baseUrl = _apiUrl;
    options.headers = {
      'Content-Type': 'application/json',
    };

    _dio = Dio(options);
  }

  Future<Response> signup(
      String username, String email, String password) async {
      try {
        return await _dio!.post(
          '$_apiUrl/auth/signup',
          data: {
            'username': username,
            'email': email,
            'password': password,
          },
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<Response> signin(String email, String password) async {
    try {
      return await _dio!.post('$_apiUrl/auth/signin', data: {
        'email': email,
        'password': password,
      }, options: Options(validateStatus: (status) {
        return status! < 500;
      }));
    } catch (e) {
      rethrow;
    }
  }

  Future<Response> verify(String token) async {
    try {
      return await _dio!.post('$_apiUrl/auth/verify',
          options: Options(headers: {'Authorization': 'Bearer $token'}));
    } catch (e) {
      rethrow;
    }
  }
}
