import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Config } from '@core/models/config.models';
import { ConfigsService } from '@core/services/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { basicAlert } from '@shared/alert/toasts';
import { TYPE_ALERT } from '@shared/alert/values.config';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  title: string;
  config: Config;
  configTemp: Config;
  onlyView: boolean;
  submitted = false;
  habilitaGuardar: boolean;
  visualizarBotones: boolean;
  captureConfig: FormGroup;
  exchangeRatePattern = '^[0-9]{1,2}(?:\\.[0-9]{1,2})?$';

  constructor(
    private formBuilder: FormBuilder,
    public modal: NgbModal,
    public configsService: ConfigsService
  ) { }

  get f() { return this.captureConfig.controls; }

  ngOnInit(): void {
    this.title = 'Configuraciones del MarketPlance';
    this.config = new Config();
    this.configTemp = new Config();
    this.onlyView = true;
    this.habilitaGuardar = false;
    this.visualizarBotones = false;
    this.captureConfig = this.formBuilder.group({
      id: ['', [Validators.required]],
      exchange_rate: [0.0, [Validators.required, this.exchangeRateValidator]],
      minimum_offer: [0, [Validators.required]],
      offer: [true, [Validators.required]],
      message: ['', [Validators.required]]
    });
    this.configsService.getConfig('1').subscribe((result) => {
      this.configTemp.id = result.id;
      this.configTemp.message = result.message;
      this.configTemp.exchange_rate = result.exchange_rate;
      this.configTemp.minimum_offer = result.minimum_offer;
      this.configTemp.offer = result.offer;
      this.config = this.configTemp;
      this.onSetConfig(this.config);
    });
  }

  exchangeRateValidator(control: FormControl) {
    const value = control.value;
    // Expresión regular para validar 2 enteros y 2 decimales
    const pattern = /^[0-9]{1,2}(?:\.[0-9]{1,2})?$/;
    if (!pattern.test(value)) {
      return { invalidExchangeRateFormat: true };
    }
    return null;
  }

  // tslint:disable-next-line: no-unnecessary-initializer
  onSetConfig(config: Config = undefined) {
    if (config) {
      this.captureConfig.controls.id.setValue(config.id);
      this.captureConfig.controls.message.setValue(config.message);
      this.captureConfig.controls.exchange_rate.setValue(config.exchange_rate);
      this.captureConfig.controls.minimum_offer.setValue(config.minimum_offer);
      this.captureConfig.controls.offer.setValue(config.offer);
      return;
    }
    this.config.id = this.captureConfig.controls.id.value;
    this.config.message = this.captureConfig.controls.message.value;
    this.config.exchange_rate = parseFloat(this.captureConfig.controls.exchange_rate.value);
    this.config.minimum_offer = parseInt(this.captureConfig.controls.minimum_offer.value);
    this.config.offer = this.captureConfig.controls.offer.value;
  }

  onModificar() {
    this.onlyView = false;
    this.visualizarBotones = true;
  }

  onCancelar() {
    this.onSetConfig(this.configTemp);
    this.onlyView = true;
    this.visualizarBotones = false;
  }

  onGrabar() {
    this.submitted = true;
    if (this.captureConfig.invalid) {
      basicAlert(TYPE_ALERT.WARNING, 'Verificar campos');
      return;
    }
    this.onSetConfig();
    this.onlyView = true;
    this.visualizarBotones = false;
    this.updateCatalog(this.config);
  }

  private updateCatalog(config: Config) {
    if (config.message !== '') {
      this.configsService.update(config).subscribe(
        (res: any) => {
          if (res.status) {
            basicAlert(TYPE_ALERT.SUCCESS, res.message);
            setTimeout(() => {
              this.onSetConfig(config);
            }, 2900);
          } else {
            basicAlert(TYPE_ALERT.WARNING, res.message);
          }
        }
      );
    }
  }
}
