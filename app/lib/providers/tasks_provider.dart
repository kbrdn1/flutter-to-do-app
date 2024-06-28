import 'package:flutter/cupertino.dart';
import 'package:provider/provider.dart';
import '../services/tasks_service.dart';

class TasksProvider extends ChangeNotifier {
  TasksService? _tasksService;
  List<Map<String, dynamic>> _tasks = [];
  String? _error;

  List<Map<String, dynamic>> get tasks => _tasks;
  String? get error => _error;
  
  void _setError(String? value) {
    _error = value;
    notifyListeners();
  }
  
  TasksProvider(String token) {
    _tasksService = TasksService(token);
  }

  Future<void> getAllTasks() async {
    try {
      final response = await _tasksService!.index();
      if (response.statusCode == 200) {
        _tasks = response.data['items'];
        _setError(null);
        notifyListeners();
      }
    } catch (e) {
      _setError(e.toString());
      return;
    }
  }
  
  Future<void> showTask(num id) async {
    try {
      final response = await _tasksService!.show(id);
      if (response.statusCode == 200) {
        _tasks = [response.data['task']];
        _setError(null);
        notifyListeners();
      }
    } catch (e) {
      _setError(e.toString());
      return;
    }
  }

  Future<void> storeTask(String content, String deadline, num user_id, num? statusId, num? priorityId) async {
    try {
      final response = await _tasksService!.store(content, deadline, user_id, statusId, priorityId);
      if (response.statusCode == 201) {
        _tasks.add(response.data['task']);
        _setError(null);
        notifyListeners();
      }
    } catch (e) {
      _setError(e.toString());
      return;
    }
  }

  Future<void> updateTask(num id, String content, String deadline, num? statusId, num? priorityId) async {
    try {
      final response = await _tasksService!.update(id, content, deadline, statusId, priorityId);
      if (response.statusCode == 200) {
        final index = _tasks.indexWhere((task) => task['id'] == id);
        _tasks[index] = response.data['task'];
        _setError(null);
        notifyListeners();
      }
    } catch (e) {
      _setError(e.toString());
      return;
    }
  }

  Future<void> deleteTask(num id) async {
    try {
      final response = await _tasksService!.delete(id);
      if (response.statusCode == 200) {
        _tasks.removeWhere((task) => task['id'] == id);
        _setError(null);
        notifyListeners();
      }
    } catch (e) {
      _setError(e.toString());
      return;
    }
  }
  
}