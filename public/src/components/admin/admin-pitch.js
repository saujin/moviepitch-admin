moviePitchApp.directive('adminPitch', function(){
	return {
		link: function(scope, el, attrs){
			const curState = el.attr('data-current-status');

			el.find('button').on('click', function(){
				el.addClass('animate-out');
				const newState = this.getAttribute('data-to-status');

				if(newState === "rejected"){
					scope.rejectPitch(attrs.id, newState)
				} else {
					scope.updatePitch(attrs.id, newState, curState);
				}

			});
		},
		restrict: "A"
	}
});