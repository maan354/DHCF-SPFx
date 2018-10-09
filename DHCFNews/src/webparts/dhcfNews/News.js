$(function(){
    var allNews = [];
        $.ajax({
            url: _spPageContextInfo.siteAbsoluteUrl + "/_api/web/Lists/GetByTitle('Announcments')/items?"+
                "$top=5&$orderby=Announcement_x0020_Date desc" +
                "",
            type: "Get",
            async: false,
            headers: { 
                "Accept": "application/json;odata=verbose",
                "content-Type": "application/json;odata=verbose"
            }
        }).done(function(data){
               var data = data.d.results;
               $.each(data, function(i, item){
                    allNews.push({
                     Header: item.Title,
                     Description: item.Announcement_x0020_Description,
                     Date: item.Announcement_x0020_Date
                 });
              });
        });
        allNews.sort(function(a,b) {
            return  new Date(b.Date) - new Date(a.Date);
        });

        allNews = allNews.slice(0, 5);
        //console.log(allFAQs);
        
        allNews.forEach(function(item){
            $('#all-news').append('<div class="item news-item">' + item.Header + '<div>'+item.Description+'</div></div>');
        })
        
    //});
})
