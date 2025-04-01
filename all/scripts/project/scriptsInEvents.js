


const scriptsInEvents = {

	async Egame_Event217_Act2(runtime, localVars)
	{
		// Попробуем инициировать и показать баннер
		try {
		    // Инициализация Adsgram и показ баннера
		    await window.Adsgram.init({ blockId: "int-7184" }).show();
		} catch (error) {
		    // Обработка ошибок: ничего не делаем или выполняем другие действия
		    console.error("Ошибка при показе рекламы:", error);
		}
	},

	async Egame_Event239_Act8(runtime, localVars)
	{
		// Попробуем инициировать и показать баннер
		try {
		    // Инициализация Adsgram и показ баннера
		    await window.Adsgram.init({ blockId: "int-7184" }).show();
		} catch (error) {
		    // Обработка ошибок: ничего не делаем или выполняем другие действия
		    console.error("Ошибка при показе рекламы:", error);
		}
	},

	async Egame_Event279_Act2(runtime, localVars)
	{
		// Попробуем инициировать и показать баннер
		try {
		    // Инициализация Adsgram и показ баннера
		    await window.Adsgram.init({ blockId: "int-7184" }).show();
		} catch (error) {
		    // Обработка ошибок: ничего не делаем или выполняем другие действия
		    console.error("Ошибка при показе рекламы:", error);
		}
	},

	async Emenu_Event1_Act12(runtime, localVars)
	{
		const script = document.createElement('script');
		script.src = "https://telegram.org/js/telegram-web-app.js";
		document.head.appendChild(script);
	},

	async Emenu_Event1_Act13(runtime, localVars)
	{
		const script = document.createElement('script');
		   script.src = "https://w.tads.me/widget.js";
		   document.head.appendChild(script);
		  
	},

	async Emenu_Event2_Act1(runtime, localVars)
	{
		const div = document.createElement('div');
		   div.id = 'tads-container-308'; // Замените на ваш идентификатор
		   document.body.appendChild(div);
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

