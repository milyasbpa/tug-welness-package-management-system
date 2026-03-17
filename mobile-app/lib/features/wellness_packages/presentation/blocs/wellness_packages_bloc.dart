import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_starter_kit/features/wellness_packages/domain/entities/get_packages_params.dart';
import 'package:flutter_starter_kit/features/wellness_packages/domain/usecases/get_wellness_packages_use_case.dart';
import 'package:flutter_starter_kit/features/wellness_packages/presentation/blocs/wellness_packages_event.dart';
import 'package:flutter_starter_kit/features/wellness_packages/presentation/blocs/wellness_packages_state.dart';
import 'package:injectable/injectable.dart';

/// Manages the lifecycle for the Wellness Packages feature.
@injectable
class WellnessPackagesBloc
    extends Bloc<WellnessPackagesEvent, WellnessPackagesState> {
  WellnessPackagesBloc(this._getPackages)
      : super(const WellnessPackagesInitial()) {
    on<WellnessPackagesLoadRequested>(_onLoadRequested);
    on<WellnessPackagesLoadMoreRequested>(_onLoadMoreRequested);
  }

  final GetWellnessPackagesUseCase _getPackages;

  Future<void> _onLoadRequested(
    WellnessPackagesLoadRequested event,
    Emitter<WellnessPackagesState> emit,
  ) async {
    emit(const WellnessPackagesLoading());
    final params = GetPackagesParams(search: event.search);
    final result = await _getPackages(params);
    result.fold(
      (failure) => emit(WellnessPackagesError(message: failure.message)),
      (data) => emit(
        WellnessPackagesLoaded(
          packages: data.packages,
          paginatedData: data,
          activeParams: params,
        ),
      ),
    );
  }

  Future<void> _onLoadMoreRequested(
    WellnessPackagesLoadMoreRequested event,
    Emitter<WellnessPackagesState> emit,
  ) async {
    final current = state;
    if (current is! WellnessPackagesLoaded) return;
    if (!current.paginatedData.hasNextPage) return;

    emit(current.copyWith(isLoadingMore: true));

    final nextPage = current.paginatedData.page + 1;
    final params = GetPackagesParams(
      page: nextPage,
      search: current.activeParams.search,
      limit: current.activeParams.limit,
      sortBy: current.activeParams.sortBy,
      sortOrder: current.activeParams.sortOrder,
    );
    final result = await _getPackages(params);
    result.fold(
      (failure) => emit(WellnessPackagesError(message: failure.message)),
      (data) => emit(
        WellnessPackagesLoaded(
          packages: [...current.packages, ...data.packages],
          paginatedData: data,
          activeParams: params,
        ),
      ),
    );
  }
}
