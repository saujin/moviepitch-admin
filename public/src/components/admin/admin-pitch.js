moviePitchApp.directive('adminPitch', function(){
	return {
		link: function(scope, el, attrs){
			const curState = el.attr('data-current-status');

			el.find('button').on('click', function(){
				const newState = this.getAttribute('data-to-status');
				scope.updatePitch(attrs.id, newState, curState);
			});
		},
		restrict: "A"
	}
});