import { inject, injectable } from 'inversify';
import { Component } from '../../../framework/component';
import { EventsInterface } from '../../../framework/utilities/eventsInterface';
import { LoggerInterface } from '../../../framework/utilities/loggerInterface';
import { TilemapStrategyInterface } from '../../strategies/tilemapStrategyInterface';
import { Constants } from '../../utilities/constants';
import { PlayerData } from '../player';

@injectable()
export class NPCs extends Component {
    private logger: LoggerInterface;
    private events: EventsInterface;
    private constants: Constants;
    private npcs: Phaser.GameObjects.Sprite[] = [];
    private player: PlayerData;
    private tilemapStrategy: TilemapStrategyInterface;

    constructor(@inject('LoggerInterface') logger: LoggerInterface, @inject('EventsInterface') events: EventsInterface, @inject('Constants') constants: Constants, @inject('TilemapStrategyInterface') tilemapStrategy: TilemapStrategyInterface) {
        super();

        this.events = events;
        this.logger = logger;
        this.constants = constants;
        this.tilemapStrategy = tilemapStrategy;
    }

    public create(): void {
        this.events.on('npc', (event: Phaser.Types.Tilemaps.TiledObject) => {
            const sprite = this.scene.add.sprite(this.constants.ZERO, this.constants.ZERO, 'textures', 'npc');
            sprite.setScale(this.constants.SCALE);
            sprite.setDepth(this.constants.OBJECT_DEPTH);
            sprite.flipX = event.flippedHorizontal;
            sprite.flipY = event.flippedVertical;
            sprite.setPosition((event.x + sprite.width * this.constants.HALF) * this.constants.SCALE, (event.y - sprite.height * this.constants.HALF) * this.constants.SCALE);
            sprite.anims.play('npcIdle', true);
            this.scene.physics.add.existing(sprite, true);
            (sprite.body as Phaser.Physics.Arcade.Body).setCircle(16);
            (sprite.body as Phaser.Physics.Arcade.Body).setOffset(-16 + (sprite.width * this.constants.SCALE * this.constants.HALF), -16 + (sprite.height * this.constants.SCALE * this.constants.HALF));
            this.npcs.push(sprite);

            const type = this.tilemapStrategy.getProperty<string>(event, 'type');
            const sprite2 = this.scene.add.sprite(this.constants.ZERO, this.constants.ZERO, 'textures', type);
            sprite2.setScale(this.constants.SCALE);
            sprite2.setDepth(this.constants.OBJECT_DEPTH);
            sprite2.setPosition((event.x + sprite.width + 4) * this.constants.SCALE, event.y - event.height * this.constants.SCALE);
            sprite2.setAlpha(0);
            sprite.setData('bubble', sprite2);
            sprite.setData('active', false);
        });

        this.events.on('playerCreated', (player: PlayerData) => {
            this.player = player;
        });
    }

    public update() {
        for (let i = 0; i < this.npcs.length; i++) {
            const npc = this.npcs[i];
            const bubble: Phaser.GameObjects.Sprite = npc.getData('bubble');

            const collide = this.scene.physics.overlap(npc, this.player.sprite);
            if (!npc.getData('active') && collide) {
                this.scene.tweens.add({
                    targets: bubble,
                    alpha: { from: 0, to: 1 },
                    ease: 'Linear',
                    duration: 200,
                    repeat: 0,
                    yoyo: false
                });
                npc.setData('active', true);
            } else if (npc.getData('active') && !collide) {
                this.scene.tweens.add({
                    targets: bubble,
                    alpha: { from: 1, to: 0 },
                    ease: 'Linear',
                    duration: 200,
                    repeat: 0,
                    yoyo: false
                });
                npc.setData('active', false);
            }
        }
    }
}
