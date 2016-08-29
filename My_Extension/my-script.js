// 使用匿名函数包裹，使得代码不至于污染全局;
(function() {


  // 广告过滤
  var clearAd = {
    clear: function() {
      var ad_tag_name = ['footer'];
      var ad_class_Name = ['top-banner-ad-container',
        'js-navigation-header',
        'content-footer',
        'l-footer u-cf',
        'site-message',
        'js-components-container',
        'content__secondary-column',
        'content__labels',
        'content__meta-container',
        'submeta'
      ]

      for (var i in ad_tag_name) {
        $(ad_tag_name[i]).hide()
      }

      for (var i in ad_class_Name) {
        $('.' + ad_class_Name[i]).hide()
      }

      return this;
    },
    intervalClear: function() {

      setInterval(function() {
        var ad_tag_name = ['aside', '#dfp-ad--inline1', '#dfp-ad--top-above-nav'];

        for (var i in ad_tag_name) {
          $(ad_tag_name[i]).hide()
        }
      }, 1000)

    }
  }

  clearAd.clear().intervalClear();



  // 分页
  var vScroll = {
    // 当前页数
    pageIndex: 0,
    pagesNum: 0,
    // 标志，使滚动不会重复执行
    noScroll: false,
    wrapBodyInner: function() {
      // 包裹body下面的子内容，用于移动
      $('body').wrapInner('<div class="body-children-wrap"></div>')
      return this;
    },
    addEvent: function() {
      window.onmousewheel = function(event) {
        if (this.noScroll == true)
          return;
        this.noScroll = true;
        if (event.wheelDelta < 0 && this.pageIndex < this.pagesNum - 1) {
          this.scrollTo(++this.pageIndex)
          setTimeout(function() {
            this.noScroll = false
          }.bind(this), 500)
        } else if (event.wheelDelta > 0 && this.pageIndex > 0) {
          this.scrollTo(--this.pageIndex)
          setTimeout(function() {
            this.noScroll = false
          }.bind(this), 500)
        } else {
          this.noScroll = false;
        }
      }.bind(this)
      return this;
    },
    scrollTo: function(page) {
      this.pageIndex = page;
      var vHeight = document.documentElement.clientHeight,
        wrap = document.querySelector('.body-children-wrap'),
        pagesBar = document.querySelector('.page-bar-ul')
      pagesList = pagesBar.children;

      for (var i = 0; i < pagesList.length; i++) {
        if (i == page) {
          pagesList[i].className = 'on';
        } else {
          pagesList[i].className = '';
        }
      }

      wrap.style.top = '-' + vHeight * page + 'px';
      return this;
    },
    calculatePages: function() {
      var vHeight = document.documentElement.clientHeight,
        wrap = document.querySelector('.body-children-wrap'),
        pagesNum = Math.ceil(parseInt(wrap.scrollHeight) / parseInt(vHeight));
      this.pagesNum = pagesNum;
      return this;
    },
    insertPagesBar: function() {
      var body = document.body,
        ul = document.createElement('ul');
      ul.className = 'page-bar-ul';
      for (var i = 0; i < this.pagesNum; i++) {
        // 再包裹一层匿名函数，解决js循环中的闭包问题
        (function(i) {
          li = document.createElement('li');
          var that = this;
          li.onclick = function() {
            that.scrollTo(i)
          }
          li.className = '';
          li.dataset.num = i;
          if (i == 0) {
            li.className = 'on';
          }
          ul.appendChild(li);
        }.bind(this))(i)

      }

      body.appendChild(ul)

      return this;

    },
    init: function() {
      this.wrapBodyInner().calculatePages().insertPagesBar().addEvent()
    }
  }

  vScroll.init();



  // 调用扇贝API翻译
  var translate = {
    addEvent: function() {
      window.onmouseup = function(event) {
        event = event || window.event;
        var word = document.getSelection().toString().trim(),
          mouseClientLeft = event.clientX,
          mouseClientTop = event.clientY,
          bodyWidth = document.documentElement.clientWidth,
          bodyHeight = document.documentElement.clientHeight,
          y = mouseClientTop + 20,
          x = mouseClientLeft + 20;
        // 边缘检测、修正
        if (bodyHeight - mouseClientTop <= 150) {
          y = mouseClientTop - 170;
          if (y < 0)
            y = 0
        }
        if (bodyWidth - mouseClientLeft <= 250) {
          x = mouseClientLeft - 270
          if (x < 0)
            x = 0
        }


        if (word != '') {
          this.queryWord(word, x, y)
        }
      }.bind(this)
    },
    queryWord(word, x, y) {
      if (window.XMLHttpRequest) { // code for IE7, Firefox, Opera, etc.
        xmlHttp = new XMLHttpRequest();
      } else if (window.ActiveXObject) { // code for IE6, IE5
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      if (xmlHttp != null) {
        xmlHttp.open("GET", "http://api.shanbay.com/bdc/search/?word=" + word, false);
        xmlHttp.send(null);
        xmlDoc = JSON.parse(xmlHttp.responseText);
        this.showContent(xmlDoc, x, y)
      } else {
        alert("Your browser does not support XMLHTTP.");
      }
    },
    showContent(content, x, y) {
      console.info(content, x, y)
      var container = document.createElement('div');
      var id = parseInt(Math.random() * 1000000);
      container.id = id;
      container.className = 'word-content';
      // container.innerHTML=JSON.stringify(content);
      var p_1 = document.createElement('p');
      var p_2 = document.createElement('p');
      var strong_1 = document.createElement('strong');
      strong_1.innerHTML = content.data.content;
      p_1.appendChild(strong_1);
      p_1.appendChild(document.createTextNode(' [' + content.data.pronunciation + ']'))
      span_audio = document.createElement('span');
      span_audio.innerHTML = ' <strong style="display:inline-block;padding:2px;color:rgb(36,153,239);font-size:24px"> ♬ </strong> ';
      span_audio.onclick = function() {
        var my_audio = $('#' + id + ' #my_audio')[0];
        // my_audio.load();
        my_audio.play();
      }
      p_1.appendChild(span_audio);
      p_2.appendChild(document.createTextNode(content.data.definition))
      container.appendChild(p_1)
      container.appendChild(p_2)
      audio = document.createElement('audio');
      audio.id = 'my_audio';
      audio.src = content.data.audio;
      container.appendChild(audio)
      container.style.left = x + 'px';
      container.style.top = y + 'px';

      var body = document.body;
      body.appendChild(container)

      setTimeout(function() {
        document.getElementById(id).remove();
      }, 5000)

    }
  }

  translate.addEvent();


})()