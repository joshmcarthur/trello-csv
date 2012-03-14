(function() {
  var TrelloCSVExport;

  TrelloCSVExport = (function() {

    function TrelloCSVExport() {
      var _this = this;
      $('#login').click(function() {
        return Trello.authorize({
          type: 'popup',
          success: _this.authorized
        });
      });
      $('#boards').chosen().change(function(event) {
        Trello.boards.get($(event.target).val(), function(board) {
          return _this.board = board;
        });
        return $('.export-button').show();
      });
      $('#export').click(function() {
        return _this.board_to_csv();
      });
    }

    TrelloCSVExport.prototype.authorized = function() {
      $('#login').addClass('disabled');
      return Trello.get('members/me/boards', function(boards) {
        $.each(boards, function(index, board) {
          return $('#boards').append($('<option></option>').val(board.id).text(board.name));
        });
        $('#boards').trigger('liszt:updated');
        return $('.board-select').show();
      });
    };

    TrelloCSVExport.prototype.board_to_csv = function() {
      var _this = this;
      this.csv_string = "";
      this.csv_sep = ",";
      this.line_ending = "\n";
      return Trello.boards.get("" + this.board.id + "/lists", {
        cards: 'open',
        card_fields: 'name,desc',
        fields: 'name'
      }, function(lists) {
        $.each(lists, function(index, list) {
          _this.csv_string += _this.csv_sep + _this.csv_sep + _this.line_ending;
          _this.csv_string += "" + list.name + _this.csv_sep + _this.line_ending;
          return $.each(list.cards, function(index, card) {
            return _this.csv_string += "" + card.name + _this.csv_sep + card.desc + _this.line_ending;
          });
        });
        return $('<form></form>', {
          action: "http://savefile.herokuapp.com/" + _this.board.name + ".csv",
          method: 'post'
        }).append($('<input></input>', {
          type: 'hidden',
          name: 'content',
          value: _this.csv_string
        })).submit();
      });
    };

    return TrelloCSVExport;

  })();

  window.TrelloCSVExport = TrelloCSVExport;

}).call(this);
