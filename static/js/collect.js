(function() {
  const getStockInfo = (id) => {
    let url = `http://${location.host}/getStockInfo?id=${id}`
    $.getJSON(url).done(function(data) {
      if (data && data.state === 1 && data.data.length > 0) {
        data = data.data;
        $('#stockName').val(data[0].stockName)
      }
    })
  }
  $('#stockNum_input').on('blur', function(e) {
    console.log($(this).val())
    console.log(location.host)
    getStockInfo($(this).val())
  })
})();