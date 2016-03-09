moviePitchApp.directive('adminPitch', function(){
	return {
		link: function(scope, el, attrs){
			const curState = el.attr('data-current-status');

			el.find('button').on('click', function(){
				el.addClass('animate-out');
				const newState = this.getAttribute('data-to-status');


				if(newState === "rejected"){
					scope.rejectPitch(attrs.id, curState)
				}
				else if (newState === "accepted"){
					scope.acceptPitch(attrs.id, curState)
				}
				else {
					scope.updatePitch(attrs.id, newState, curState);
				}

			});
		},
		restrict: "A"
	}
});