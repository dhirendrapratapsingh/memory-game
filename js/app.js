/*
 * Create a list that holds all of your cards
 */
var cardList =["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor", "fa-bolt", "fa-bolt",
              "fa-cube", "fa-cube", "fa-leaf", "fa-leaf", "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];
//all the corresponding font symbol items are  loaded as predefined classes from fontawsome
var opened = [],matches = 0,moves=0,delay=200, stars = 3,seconds,totalSeconds,totalMinutes,timer,ct;
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array)
{
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0)
  {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
  }
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
 function startCardGame() ///game begins here
 {

  var shuffldCards= shuffle(cardList); ///shulleing cards at each game start
  $('.deck').empty();
  moves= 0; //initialling variables at start of game
  matches= 0;
  stars = 3;
  seconds= 0;
  ct=null;
  totalMinutes= 0;
  totalSeconds= 0;
  $('.moves').text('0');
  $('i').removeClass('fa fa-star-o').addClass('fa fa-star');

  //shuffldCards.forEach(function(crd,i)
  for(let x=0; x < shuffldCards.length; x++)
  {
   $('.container .deck').append('<li class="card"><i class="fa ' + shuffldCards[x] + '"></i></li>');
   $('.container .deck .card').eq(x).attr("id",x); // eq() gives unique id to each card element
  }
  var gameRunning = false;
  /*
  * set up the event listener for a card. If a card is clicked:
  *  - display the card's symbol (put this functionality in another function that you call from this one)
  *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
  *  - if the list already has another card, check to see if the two cards match
  *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
  *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
  *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
  *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
  */

 // open Card
 $('.deck').find('.card:not(".match, .open")').click(function()
 {
 	var	c = $(this).html();
  if($(this).hasClass('open show'))
  {
    return; //if card is already opened no more then no handler operatons for click event
  }
  $(this).addClass('open show');
 	opened.push(c);
  if(!gameRunning){
    ct= new Date().getTime() / 1000; //the time in seconds for first click is stored in ct
  }
  gameRunning = true;

  //comparing curent card (c) with previous already opened card(opened[0])
  if (opened.length > 1)
  {
    if (c === opened[0])
    {
      $('.deck').find('.open').addClass('match animated infinite rubberBand'); // wooble and ruuberband are defined in dnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css
      setTimeout(function()
      {
        $('.deck').find('.match').removeClass('open show animated infinite rubberBand');
      }, delay);
      matches++;
      moves++
    }
    else
    {
      $('.deck').find('.open').addClass('notmatch animated infinite wobble');
      setTimeout(function()
      {
        $('.deck').find('.open').removeClass('animated infinite wobble');
      }, delay / 1.5);
      setTimeout(function()
      {
        $('.deck').find('.open').removeClass('open show notmatch animated infinite wobble');
      }, delay);

      moves++; //if some othere card is clicked then only moves is incremented
    }
    opened = []; //reinitiallizing opened arrary

    $('.moves').html(moves);

    starRating(moves);

    if((cardList.length / 2) === matches)
    {
    gameOver(moves, stars);
    }
  }       //end of 2nd cheking of 2nd flip

});       //end of cilck event

timer = setInterval(function() //to update the timer panel each second after first click
 {
   var ctime = ct || (new Date().getTime() / 1000);
   seconds= parseInt((new Date().getTime() / 1000)-ctime);
   totalSeconds= seconds%60;
   totalMinutes=parseInt(seconds / 60);
   $('.seconds').text(totalSeconds);
   $('.minutes').text(parseInt(totalMinutes));
 }, 1000);

}            // end of starCardGmae


  function starRating(moves)  //determines the star rating depending upon moves
  {
    if (moves>12 && moves<=18)
    {
      $("i").eq(2).removeClass('fa fa-star').addClass('fa fa-star-o');
      stars = 2;
    }
    else if (moves>18)
    {
      $("i").eq(1).removeClass('fa fa-star').addClass('fa fa-star-o');
      stars = 1;
    }

  }

  function gameOver(moves, stars)    //after all cards are matched shows congratulations message wit time taken and stars obtained
  {
  	swal({
  		allowEscapeKey: false,
  		allowOutsideClick: false,
  		title: 'Congratulations! You have Won!',
  		text: 'With ' + moves + ' steps and ' + stars + ' Stars.\n Woooooo! \n Time Taken: '+ totalMinutes +' Minutes -'+totalSeconds+' Seconds',
  		type: 'success',
  		confirmButtonColor: '#82d8e7',
  		confirmButtonText: 'Play again!'
  	     }).then(function() {startCardGame();})
      clearInterval(timer);
      gameRunning = false;
  }

  $('.restart').click(function() //to restart the game at any moment in middle of the game
  {
    swal({
      allowEscapeKey: false,
      allowOutsideClick: false,
      title: 'Are you sure?',
      text: "Your progress will be Lost!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#82d8e7',
      cancelButtonColor: '#2bcf00',
      confirmButtonText: 'Yes, Restart !'
    }).then(function() {
      clearInterval(timer);
      gameRunning = false;
      startCardGame();})
  });
  startCardGame();
