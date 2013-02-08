class TrelloCSVExport
  constructor: ->
    $('#login').click =>
      Trello.authorize(
        type: 'popup',
        success: @authorized
      )
    $('#boards').chosen().change (event) =>
      Trello.boards.get $(event.target).val(), (board) =>
        @board = board
      $('.export-button').show()

    $('#export').click =>
      @board_to_csv()

  authorized: ->
    $('#login').addClass('disabled')
    Trello.get 'members/me/boards', (boards) ->
      $.each boards, (index, board) ->
        $('#boards').append($('<option></option>').val(board.id).text(board.name))
      $('#boards').trigger('liszt:updated')
      $('.board-select').show()

  board_to_csv: ->
    @csv_string = ""
    @csv_sep = ","
    @line_ending = "\n"
    Trello.boards.get "#{@board.id}/lists", { cards: 'open', card_fields: 'name,desc', fields: 'name'}, (lists) =>
      $.each lists, (index, list) =>
        @csv_string += (@csv_sep + @csv_sep + @line_ending)
        @csv_string += "\"#{list.name}\"#{@csv_sep}\"\"#{@line_ending}"
        $.each list.cards, (index, card) =>
          @csv_string += "\"#{card.name.replace(/"/g, '""')}\"#{@csv_sep}\"#{card.desc.replace(/"/g, '""')}\"#{@line_ending}"
      # #TODO replace with jquery.savefile
      $('<form></form>', { action: "http://savefile.herokuapp.com/#{@board.name}.csv", method: 'post'}).append(
        $('<input></input>', { type: 'hidden', name: 'content', value: @csv_string })
      ).submit()

window.TrelloCSVExport = TrelloCSVExport


