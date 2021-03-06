angular.module("FPApp.services", ['angular-cache'])

.service("FPSvc2", [
                 "$http", "$rootScope", "$ionicLoading", "$filter", "$q", "CacheFactory",
  function FPSvc2($http,   $rootScope,   $ionicLoading,   $filter,   $q,   CacheFactory) {

      if (!CacheFactory.get('linesCache')) {
        CacheFactory.createCache('linesCache', {
          storageMode: 'localStorage'
        });
        // clear cache with
        // CacheFactory.destroy('linesCache');
      }

      var linesCache = CacheFactory.get('linesCache');

      this.loadLines = function() {
        return $http.get("http://www.gerenciamentorgcom.com.br/m/ws/linhas_web.php", {
                  params: {user: "37"},
                  cache: linesCache
                });
      }

      this.getLine = function(id) {
        // cria um promise que será retornado assim que
        // o promise anterior retornar
        var deferred = $q.defer();
        this.loadLines()
          .success(function(data) {
            // data é a lista de linhas
            deferred.resolve(data.findById(id))
          })
          .error(deferred.reject);
        return deferred.promise;
      }

      this.loadItineraries = function(id_line, params_horario, params_tabela) {
          return $http.get("http://www.gerenciamentorgcom.com.br/m/ws/horarios_web.php", {
                  params: {linha: id_line, tabela: params_tabela, horario: params_horario, user: 37 },
                  cache: linesCache
                });
      }

      this.getItinerary = function(id_line, params_horario, params_tabela, id_itinerary) {
        // cria um promise que será retornado assim que
        // o promise anterior retornar
        var deferred = $q.defer();
        this.loadItineraries(id_line, params_horario, params_tabela)
          .success(function(data) {
            // data é a lista de linhas
            deferred.resolve(data.findBy("itinerario", id_itinerary))
          })
          .error(deferred.reject);
        return deferred.promise;
      }

      this.loadStations = function(itinerary) {
        return $http.get("http://www.gerenciamentorgcom.com.br/m/ws/trajetos_web.php", {
                  params: {itinerario: itinerary, user: 37 },
                  cache: linesCache
                });
      }

      this.loadBusLocale = function(itinerary) {
        // [{"dtresposta":"2015-11-07 21:41:43","lat":"-29.166825","lng":"-51.177123"}]
        return $http.get("http://www.gerenciamentorgcom.com.br/m/ws/bus_web.php", {
                  params: {itinerario: itinerary, user: 37 },
                });
      }

      this.searchPeriodForDays = function () {
        return 0;
        var today = new Date().getHours();
        if (today >= 5 && today <= 12) {
          //Das 05:00 às 12:00
          return 1;
        } else if (today >= 13 && today <= 18) {
          //Das 12:00 às 18:00
          return 2;
        } else if (today >= 19 && today <= 23) {
          //Das 18:00 às 24:00
          return 3;
        } else if (today >= 0 && today <= 4) {
          // Das 24:00 às 05:00
          return 4;
        }else {
          // TODOS OS HORÁRIOS
          return 0;
        }
      }

      this.searchPeriodForWeek = function () {
        var current_date = new Date();
        // BUSCA FERIADO;
        searchFeriado = $filter('filter')(holidayList, {data: current_date.getDate()+"/"+(current_date.getMonth()+1) });
        if (Object.keys(searchFeriado).length!=0) {
          return 6;
        }

        // BUSCA O DIA DA SEMANA
        switch (current_date.getDay()) {
            case 0:
              // DOMINGO
              return 3;
            case 6:
              // SÁBADO
              return 2;
            default:
              // DIAS DE SEMANA
              return 1;
        }
      }
  }
])


.service('sharedProperties', function () {
    var params = '';

    return {
        getParams: function () {
            return params;
        },
        setParams: function(value) {
            params = value;
        }
    };
})


;
