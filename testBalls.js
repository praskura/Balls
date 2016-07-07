//random color func
		function randomColor() {
			var letter = "0123456789ABCDEF".split("");
			var color = "#";
			for (var i = 0; i < 6; i++) {
				color += letter[Math.round(Math.random()*15)];
			}
			return color;
		}

		//mouse
		var mouse = {
			x : 0,
			y : 0,
			down : false
		};

		var selected = false;

		var isCursorAtBall = function(ball) {
			return Math.sqrt(((mouse.x - ball.x)*(mouse.x - ball.x)) + ((mouse.y - ball.y)*(mouse.y - ball.y))) <= ball.r;
		};


		document.addEventListener("DOMContentLoaded", ready);
		function ready() {
			var cnv = document.getElementById("canvas");

			
			//canvas properties
			cnv.width = 600;
			cnv.height = 700;
			cnv.borderColor = "#000000";
			cnv.borderWidth = 5;
			cnv.gBorderWidth = 20;

			//array of balls
			var balls = [];

			var gravity = 4;
			var ballsCount = 5;

			//ball
			function Ball(x, y, r, color) {
				this.x = x;
				this.y = y;
				this.r = r;
				this.color = color;

				this.vx = 0;
				this.vy = 0;

				this.draw = function() {
					ctx.beginPath();
					ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
					ctx.fillStyle = this.color;
					ctx.fill();
				}

				this.stroke = function() {
					ctx.beginPath();
					ctx.beginPath();
					ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
					ctx.fillStyle = "#000000";
					ctx.stroke();
				}
			};

			var drawCnvBorder = function() {
				ctx.beginPath();
				ctx.lineWidth = cnv.borderWidth;
				ctx.strokeStyle = cnv.borderColor;
				ctx.rect(0, 0, cnv.width, cnv.height);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(0, cnv.height/2);
				ctx.lineWidth = cnv.gBorderWidth;
				ctx.lineTo(cnv.width, cnv.height/2);
				ctx.stroke();
				ctx.lineWidth = cnv.borderWidth;
			}

			var ctx = cnv.getContext('2d');
			
			for (var i = 0; i < ballsCount; i++) {
				/*if (sessionStorage.getItem("saved") == "true")
					balls.push(new Ball(sessionStorage.getItem("x"+i), sessionStorage.getItem("y"+i), sessionStorage.getItem("r"+i), sessionStorage.getItem("c"+i)));
				else*/
					balls.push(new Ball(Math.random()*cnv.width, Math.random()*cnv.height/2, 10+Math.random()*15, randomColor()));
				balls[i].vx = 2;
				balls[i].vy = 2;
			}



			setInterval(function() {
				ctx.clearRect(0, 0, cnv.width, cnv.height);
				drawCnvBorder();
				
				for (var i in balls) {
					//1st zone falling
					if (balls[i].y < (cnv.height/2 - balls[i].r - cnv.gBorderWidth/2)) {
						balls[i].y += gravity*balls[i].r*0.1;
					}

					if (isCursorAtBall(balls[i])) {
						balls[i].stroke();
					}


					//2nd zone
					if (balls[i].y > cnv.height/2) {
						//walls collision
						if (balls[i].x >= cnv.width - balls[i].r || balls[i].x <= balls[i].r)
							balls[i].vx = -balls[i].vx;

						if (balls[i].y >= cnv.height - balls[i].r || balls[i].y <= cnv.height/2 + balls[i].r)
							balls[i].vy = -balls[i].vy;

						//balls collision
						for (var j in balls) {
							if ((Math.sqrt((balls[i].x - balls[j].x)*(balls[i].x - balls[j].x) + (balls[i].y - balls[j].y)*(balls[i].y - balls[j].y))) < (balls[i].r + balls[j].r)) {
								balls[i].vx = -balls[i].vx;
								balls[i].vy = -balls[i].vy;
								balls[j].vx = -balls[j].vx;
								balls[j].vy = -balls[j].vy;
							}
						}

						balls[i].x += balls[i].vx;
						balls[i].y += balls[i].vy;
					}
					
					balls[i].draw();
				}

				//dragging
				if (selected) {
					selected.x = mouse.x - selected.r/2;
					selected.y = mouse.y - selected.r/2;
				}

				//console.log(mouse.x+", "+mouse.y);

			}, 24);

				//events
			//mouse events
			window.onmousemove = function(e) {
				mouse.x = e.pageX;
				mouse.y = e.pageY;
			};

			window.onmousedown = function() {
				if (!selected) {
					for(var i in balls) {
						if (isCursorAtBall(balls[i])) {
							selected = balls[i];
						}
					}
				}
			};

			window.onmouseup = function(e) {
				mouse.down = false;
				selected = false;
			};

			window.onbeforeunload = function() {
				saveState();
			};

			//touch events
			cnv.addEventListener('touchstart', function(e) {
				mouse.x = e.pageX;
				mouse.y = e.pageY;
				if (!selected) {
					for(var i in balls) {
						if (Math.sqrt(((e.pageX - balls[i].x)*(e.pageX - balls[i].x)) + ((e.pageY - balls[i].y)*(e.pageY - balls[i].y))) <= balls[i].r)
							selected = balls[i];
					}
				}
			});

			cnv.addEventListener('touchend', function(e) {
				mouse.down = false;
				selected = false;
			});

			function saveState() {
				for (var i in balls) {
					var xvalue = parseFloat(balls[i].x).toFixed(2);
					var yvalue = parseFloat(balls[i].y).toFixed(2);
					var rvalue = parseFloat(balls[i].r).toFixed(2);
					var cvalue = balls[i].color;
					sessionStorage.setItem("x"+i, xvalue);
					sessionStorage.setItem("y"+i, yvalue);
					sessionStorage.setItem("r"+i, rvalue);
					sessionStorage.setItem("c"+i, cvalue);
					sessionStorage.setItem("saved", true);
				}	 
			}

	}