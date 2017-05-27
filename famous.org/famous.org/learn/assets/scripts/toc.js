$(function(){

  //toggle section headings when clicked
  // $('.parent').on('click', function(){
  //   $(this).parent().find('.parent + ul').slideToggle()
  // })

  //toggle lesson sections
  $('.lesson-toggle').on('click', function(){
    $(this).next().slideToggle()
  })



});