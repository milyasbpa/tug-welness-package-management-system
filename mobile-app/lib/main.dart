import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_starter_kit/app.dart';
import 'package:flutter_starter_kit/core/constants/env_config.dart';
import 'package:flutter_starter_kit/core/di/injection.dart';
import 'package:flutter_starter_kit/core/errors/error_handler.dart';
import 'package:flutter_starter_kit/core/l10n/translations.g.dart';
import 'package:flutter_starter_kit/core/observers/app_bloc_observer.dart';
import 'package:flutter_starter_kit/features/auth/presentation/blocs/auth_bloc.dart';
import 'package:flutter_starter_kit/features/auth/presentation/blocs/auth_event.dart';
import 'package:hive_flutter/hive_flutter.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await LocaleSettings.setLocaleRaw('en');
  await Hive.initFlutter();

  configureDependencies(EnvConfig.flavor);

  getIt<AuthBloc>().add(const AuthCheckRequested());

  Bloc.observer = const AppBlocObserver();

  final errorHandler = getIt<ErrorHandler>();
  FlutterError.onError = errorHandler.handleFlutterError;

  PlatformDispatcher.instance.onError = (error, stack) {
    errorHandler.handle(error, stack);
    return true;
  };

  runZonedGuarded(() => runApp(const App()), errorHandler.handle);
}
