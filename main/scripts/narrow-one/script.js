console.log('Injected!');

let ThreeAPI;

class BetterNarrow {
	onFrameRender_Event = new Event('onFrameRender')
	onInitialization_Event = new Event('onInitialization')
	
	GetClient() {
		return globalInstance
	}
	Log(plugin, output) {
		console.log('[' + plugin + '] ' + output);
	}
	onFrameRender(func) {
		window.addEventListener("onFrameRender", function() {
			func(ThreeAPI);
		});
	}
	onInitialization(func) {
		window.addEventListener("onInitialization", function() {
			func(ThreeAPI, BetterNarrowAPI.GetClient());
		});
	}
}
let BetterNarrowAPI = new BetterNarrow();

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function init() {
	__require(['https://unpkg.com/three@latest/build/three.min.js'], function(threejs)
	{
		ThreeAPI = threejs
		
		let firstTime = true;
		
		window.addEventListener('keydown', function(event) { // this is classified as a cheat so Im going to redo it later today
			if (String.fromCharCode(event.keyCode) === "R") {
				let settings = BetterNarrowAPI.GetClient().settingsManager;
				settings.setValue("thirdpersoncam", !settings.getValue("thirdpersoncam"))
			}
			
			if (String.fromCharCode(event.keyCode) === "N") {
				BetterNarrowAPI.GetClient().gameManager.currentGame.scoreOffsetNotificationsUi.showOffsetNotification("Panic mode has been removed" , null, "hey");
			}
		});
		
		function animate() {
			requestAnimationFrame(animate); // insane calcilatopoms pl;z terust me
			
			window.dispatchEvent(BetterNarrowAPI.onFrameRender_Event); // call onRender event for plugins
			
			let client = BetterNarrowAPI.GetClient();
			
			if (client) {
				if (client.gameManager && client.gameManager.currentGame) {
					let curGame = client.gameManager.currentGame;
					
					if (curGame.getMyPlayer()) {
						let player = curGame.getMyPlayer();
						
						//client.settingsManager.setValue("thirdpersoncam", false)
						if (client.settingsManager.getValue("thirdpersoncam"))
							player.thirdPerson = true;
						else player.thirdPerson = false;
						
						player.updateModelVisibility()
					}
				}
				
			}
			
			if (client && firstTime) {
				firstTime = false;
				
				
				client.dialogManager.showAlert({
					title: "BetterNarrow",
					text: "BetterNarrow by yeemi#9764 created to allow more graphics control"
				})
				
				waitForElm('head > style:nth-child(24)').then((elm) => {
					elm.remove(); 
					
					async function addCustomStyle() {
						let styleInstance = document.createElement('style');
						styleInstance.id = "GameStyle";
						styleInstance.innerHTML = await fetch('https://raw.githubusercontent.com/Laamy/betternarrow/main/main/scripts/narrow-one/resources/dark-mode.css').then((resp) => resp.text()).then();
						document.head.prepend(styleInstance);
						document.head.insertBefore(styleInstance, document.head.firstChild);
					}
					addCustomStyle();
				});
				
				window.dispatchEvent(BetterNarrowAPI.onInitialization_Event);
			}
			
			waitForElm('#mainMenu > div.main-menu-promo-banner-container > div').then((elm) => {
				elm.style.backgroundImage =
				'url(\"https://raw.githubusercontent.com/Laamy/narrow-one-tmp/main/discord-dark.png")';
			});
		}
		animate();
	})
}
init();