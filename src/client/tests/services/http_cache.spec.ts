import {expect} from 'chai';
import {mock, when, anyString, instance, verify, resetCalls} from 'ts-mockito';
import {of as ObservableOf} from 'rxjs';
import {tap, flatMap} from 'rxjs/operators';
import {BrowserStorageService, HttpCacheService} from '../../services/caching'

describe('HttpCacheService', () => {
    let browserCache = {};
    let mockedStore: BrowserStorageService;
    let store: BrowserStorageService;
    let httpCache: HttpCacheService;
    before(() => {
        mockedStore = mock(BrowserStorageService);
        when(mockedStore.setSession(anyString(), anyString())).thenCall((sessKey, value) => browserCache[sessKey] = value);
        when(mockedStore.getSession(anyString())).thenCall(sessKey => browserCache[sessKey]);
        when(mockedStore.removeSession(anyString())).thenCall(sessKey => delete browserCache[sessKey]);
        store = instance(mockedStore);
    });

    beforeEach(() => {
        browserCache = {};
        resetCalls(mockedStore);
    })

    describe('constructor', () => {
        it('should try to load cached data from store', () => {
            browserCache = {
                shcindex: '["test"]',
                test: []
            }
            httpCache = new HttpCacheService(store);
            verify(mockedStore.getSession('shcindex')).called();
            verify(mockedStore.getSession('shc_test')).called();
            expect(httpCache).to.exist;
        });

        it('should skip invalid json in load', () =>  {
            browserCache = {
                shcindex: '["test", "corrupt"]',
                test: '[]',
                corrupt: '}>*<{'
            }
            httpCache = new HttpCacheService(store);
            verify(mockedStore.getSession('shcindex')).called();
            verify(mockedStore.getSession('shc_test')).called();
            verify(mockedStore.getSession('shc_corrupt')).called();
            expect(httpCache).to.exist;
        });

        it('should skip invalid json in index', () =>  {
            browserCache = {
                shcindex: '}>*<{',
            }
            httpCache = new HttpCacheService(store);
            verify(mockedStore.getSession('shcindex')).called();
            expect(httpCache).to.exist;
        });
    });

    describe('cacheRequest', () => {
        beforeEach(() => {
            browserCache = {};
            httpCache = new HttpCacheService(store);
        });

        it('should cache the result for 30s', (done) => {
            httpCache.cacheRequest(
                'testKey',
                ObservableOf({it_worked: true})
            ).pipe(
                tap(value => {
                    expect(value).to.not.be.null;
                    expect(value.it_worked).to.not.be.null;
                    expect(value.it_worked).to.be.true;
                    expect(browserCache[`shc_testKey`]).to.not.be.null;
                    verify(mockedStore.setSession(`shc_testKey`, anyString())).called();
                }),
                flatMap(_ => 
                    httpCache.cacheRequest(
                        'testKey',
                        ObservableOf({it_worked: true})
                    )
                )
            )
            .subscribe(
                value => {
                    expect(value).to.not.be.null;
                    expect(value.it_worked).to.not.be.null;
                    expect(value.it_worked).to.be.true;
                    expect(browserCache[`shc_testKey`]).to.not.be.null;
                    done();
                }, err=> done(err)
            );
        });

        it('should cache the result for provided value', (done) => {
            const now = new Date().valueOf();
            httpCache.cacheRequest(
                'testKey',
                ObservableOf({it_worked: true}),
                {cacheTime: 5000}
            )
            .subscribe(
                value => {
                    expect(value).to.not.be.null;
                    expect(value.it_worked).to.not.be.null;
                    expect(value.it_worked).to.be.true;
                    expect(browserCache[`shc_testKey`]).to.not.be.null;
                    try {
                        const cached = JSON.parse(browserCache[`shc_testKey`]);
                        expect(cached.expiration).to.be.greaterThan(now);
                        expect(cached.expiration).to.be.lessThan(now + 10000);
                        done();
                    } catch(e) {
                        done(e);
                    }
                }, err=> done(err)
            );
        });

        it('should skip cache if disableCache provided', (done) => {
            httpCache.cacheRequest(
                'testKey',
                ObservableOf({it_worked: true}),
                {disableCache: true}
            )
            .subscribe(
                value => {
                    expect(value).to.not.be.null;
                    expect(value.it_worked).to.not.be.null;
                    expect(value.it_worked).to.be.true;
                    expect(browserCache[`shc_testKey`]).to.be.undefined;
                    done();
                }, err=> done(err)
            );
        });

        it('should invalidate other keys', (done) => {
            httpCache.cacheRequest(
                'testKey',
                ObservableOf({it_worked: true})
            ).pipe(
                tap(value => {
                    expect(value).to.not.be.null;
                    expect(value.it_worked).to.not.be.null;
                    expect(value.it_worked).to.be.true;
                    expect(browserCache[`shc_testKey`]).to.not.be.null;
                    verify(mockedStore.setSession(`shc_testKey`, anyString())).called();
                }),
                flatMap(_ => 
                    httpCache.cacheRequest(
                        'updateKeys',
                        ObservableOf({it_worked: true}),
                        {disableCache: true, invalidateKeys:['testKey']}
                    )
                )
            )
            .subscribe(
                value => {
                    expect(value).to.not.be.null;
                    expect(value.it_worked).to.not.be.null;
                    expect(value.it_worked).to.be.true;
                    expect(browserCache[`shc_testKey`]).to.be.undefined;
                    done();
                }, err=> done(err)
            );
        });
    });
});
