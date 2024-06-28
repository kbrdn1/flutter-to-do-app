import 'package:flutter/cupertino.dart';
import 'package:flutter/scheduler.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/tasks_provider.dart';
import 'package:go_router/go_router.dart';

class Dashboard extends StatefulWidget {
  const Dashboard({Key? key}) : super(key: key);

  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  late TasksProvider tasksProvider;

  @override
  void initState() {
    super.initState();
    SchedulerBinding.instance.addPostFrameCallback((_) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      if (authProvider.token == null) {
        GoRouter.of(context).go('/signin');
      }
      tasksProvider = Provider.of<TasksProvider>(context, listen: false);
    });
  }

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      backgroundColor: CupertinoColors.systemGrey6,
      navigationBar: const CupertinoNavigationBar(
        middle: Text('Dashboard'),
      ),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(CupertinoIcons.check_mark_circled_solid,
                size: 100.0, color: CupertinoColors.systemBlue),
            const Text('Welcome to your dashboard'),
            Expanded(
              child: ListView.builder(
                itemCount: tasksProvider.tasks.length,
                itemBuilder: (context, index) {
                  final task = tasksProvider.tasks[index];
                  return CupertinoListTile(
                    title: Text(task['title']),
                    subtitle: Text(task['description']),
                  );
                },
              ),
            ),
            CupertinoButton(
              child: const Text('Sign Out'),
              onPressed: () {
                final authProvider = Provider.of<AuthProvider>(context, listen: false);
                authProvider.removeToken();
                GoRouter.of(context).go('/signin');
              },
            ),
          ],
        ),
      ),
    );
  }
}