/* Client Script - 
Type = onLoad - UI Type = All
Isolate script = false
Global = true
*/

function onLoad() {
   
    var style = document.createElement('style');
    style.innerHTML = `
        @keyframes pulseBlue {
            0% { background-color: #27348b; color: #ffffff; box-shadow: 0 0 0 0 rgba(39, 52, 139, 0.7); }
            50% { background-color: #4a90e2; color: #ffffff; box-shadow: 0 0 10px 5px rgba(39, 52, 139, 0); }
            100% { background-color: #27348b; color: #ffffff; box-shadow: 0 0 0 0 rgba(39, 52, 139, 0); }
        }
        .btn-blink-alert {
            animation: pulseBlue 2s infinite !important;
            border-color: #27348b !important;
        }
    `;
    document.head.appendChild(style);

    setInterval(function() {
        try {
            
            var topBtn = document.getElementById('sysverb_update');
            var bottomBtn = document.getElementById('sysverb_update_bottom');

            if (g_form.modified) {
                if (topBtn && !topBtn.classList.contains('btn-blink-alert')) {
                    topBtn.classList.add('btn-blink-alert');
                }
                if (bottomBtn && !bottomBtn.classList.contains('btn-blink-alert')) {
                    bottomBtn.classList.add('btn-blink-alert');
                }
            } else {
                // Si le formulaire est sauvegardé ou vierge de modifs
                if (topBtn) topBtn.classList.remove('btn-blink-alert');
                if (bottomBtn) bottomBtn.classList.remove('btn-blink-alert');
            }
        } catch (e) {

        }
    }, 1500);
}
