moviePitchApp.directive('adminPitch', function(){
	return {
		link: function(scope, el, attrs){
			$(el).find('.js-reject-unreviewed-pitch').on('click', function(){
				scope.updatePitch(attrs.id, 'rejected', 'unreviewed');
			});

			$(el).find('.js-accept-unreviewed-pitch').on('click', function(){
				scope.updatePitch(attrs.id, 'under_consideration', 'unreviewed');
			});

			$(el).find('.js-reject-under-consideration-pitch').on('click', function(){
				scope.updatePitch(attrs.id, 'rejected', 'under_consideration');
			});

			$(el).find('.js-negotiate-under-consideration-pitch').on('click', function(){
				scope.updatePitch(attrs.id, 'in_negotiation', 'under_consideration');
			});

			$(el).find('.js-reject-under-consideration-pitch').on('click', function(){
				scope.updatePitch(attrs.id, 'rejected', 'under_consideration');
			});

			$(el).find('.js-negotiate-under-consideration-pitch').on('click', function(){
				scope.updatePitch(attrs.id, 'in_negotiation', 'under_consideration');
			});

			$(el).find('.js-consider-rejected-pitch').on('click', function(){
				scope.updatePitch(attrs.id, 'under_consideration', 'rejected');
			});
		},
		restrict: "A"
	}
});