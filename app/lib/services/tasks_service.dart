import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class TasksService with ChangeNotifier {
  Dio? _dio;
  final String _apiUrl = dotenv.env['API_URL']!;

  TasksService(String token) {
    BaseOptions options = BaseOptions();
    options.baseUrl = _apiUrl;
    options.headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
    _dio = Dio(options);
  }
  
  Future<Response> index() async {
    try {
      return await _dio!.get('$_apiUrl/tasks');
    } catch (e) {
      rethrow;
    }
  }

  Future<Response> show(num id) async {
    try {
      return await _dio!.get('$_apiUrl/tasks/$id');
    } catch (e) {
      rethrow;
    }
  }

  Future<Response> store(String content, String deadline, num user_id, num? statusId, num? priorityId) async {
    try {
      return await _dio!.post(
        '$_apiUrl/tasks',
        data: {
          'content': content,
          'deadline': deadline,
          'user_id': user_id,
          'status_id': statusId,
          'priority_id': priorityId,
        },
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<Response> update(num id, String content, String deadline, num? statusId, num? priorityId) async {
    try {
      return await _dio!.put(
        '$_apiUrl/tasks/$id',
        data: {
          'content': content,
          'deadline': deadline,
          'status_id': statusId,
          'priority_id': priorityId
        },
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<Response> delete(num id) async {
    try {
      return await _dio!.delete('$_apiUrl/tasks/$id');
    } catch (e) {
      rethrow;
    }
  }
}