---
layout:
---
var baseUrl = '{{site.s3-url}}'
var dataPackageFilename = 'datapackage.json'

function formatNumber (number) {
  return number
    .toString()
    .split('')
    .reverse()
    .join('')
    .match(/.{1,3}/g)
    .join(',')
    .split('')
    .reverse()
    .join('')
}

var template
d3.text('js/dataset-details.html', function (text) {
  template = doT.template(text)
})

function datasetDetailsPeriodMouseOver (element) {
  var dataset = element.getAttribute('data-dataset')
  var value = element.getAttribute('data-value')
  var year = element.getAttribute('data-year')
  var htmlFor = element.getAttribute('data-for')

  var hoverBox = d3.select('#dataset-details-period-hover-box-' + dataset)

  hoverBox.select('.dataset-details-period-hover-box-year')
    .html(year + ' - ' + (parseInt(year) + 9))

  hoverBox.select('.dataset-details-period-hover-box-value')
    .html(formatNumber(value) + (value === 1 ? ' object' : ' objects'))

  var bar = d3.select('#' + htmlFor).node()
  var rect = bar.getBoundingClientRect()

  var top = rect.top - 75
  var left = rect.left + rect.width / 2

  hoverBox
    .style('display', 'block')
    .style('top', top + 'px')
    .style('left', left + 'px')
}

function datasetDetailsPeriodMouseOut (element) {
  var dataset = element.getAttribute('data-dataset')

  d3.select('#dataset-details-period-hover-box-' + dataset)
    .style('display', 'none')
}

d3.selectAll('#datasets .dataset-details-off .dataset-view-details')
  .on('click', function () {
    if (!template) {
      return
    }

    var id = this.dataset.datasetDetailsId
    var dataset = this.dataset.datasetName

    var dataPackageUrl = baseUrl + dataset + '/' + dataPackageFilename
    d3.json(dataPackageUrl, function (err, dataPackage) {
      if (err) {
        console.error(err)
        return
      }

      d3.selectAll('#datasets .dataset-details-off')
        .style('display', 'table-row')

      d3.selectAll('#datasets .dataset-details-on')
        .style('display', 'none')

      d3.select('#' + id + '-off')
        .style('display', 'none')

      var templateData = {
        baseUrl: baseUrl,
        id: dataPackage.name,
        fields: {},
        stats: {}
      }

      var fields = {
        title: 'Title',
        homepage: 'Homepage',
        contributors: 'Contributors',
        sources: 'Sources'
      }

      function makeLink (href, text) {
        if (!href) {
          return text
        }

        return `<a href="${href}">${text || href}</a>`
      }

      const createFieldRows = {
        homepage: function (url) {
          return [
            makeLink(url)
          ]
        },
        sources: function (sources) {
          return sources
            .map(function (source) {
              return makeLink(source.path, source.title)
            })
        },
        contributors: function (contributors) {
          return contributors
            .map(function (contributor) {
              var title = contributor.title + (contributor.role ? (' (' + contributor.role + ')') : '')
              var href = contributor.email ? ('mailto:' + contributor.mailto) : contributor.path
              return makeLink(href, title)
            })
        }
      }

      var templateDatasetJson = {}
      Object.keys(fields).forEach(function (field) {
        if (dataPackage[field]) {
          var fieldTitle = fields[field]
          var rows = createFieldRows[field] && createFieldRows[field](dataPackage[field])
          if (rows) {
            templateData.fields[fieldTitle] = rows
          }
        }
      })

      var objectsResource = dataPackage.resources
        .filter(function (resource) {
          return resource.name === dataPackage.name + '.objects'
        })[0]

      if (objectsResource && objectsResource.stats) {
        var stats = objectsResource.stats

        templateData.stats.objects = {}
        templateData.stats.objects.count = formatNumber(stats.count)

        var types = []

        Object.keys(stats.types).forEach(function (type) {
          var count = stats.types[type]
          types.push({
            type: type,
            count: count
          })
        })

        templateData.stats.objects.types = types
          .sort(function (a, b) {
            return b.count - a.count
          }).slice(0, 3).map(function (type) {
            return type.type
          })

        if (stats.decades) {
          var decades = stats.decades

          var newDecades = []
          var total = stats.count

          var yearStart = 1710
          var yearEnd = 1960
          var yearStep = 10

          var maxCount = 0
          Object.keys(decades).forEach(function (decade) {
            if (decades[decade] > maxCount) {
              maxCount = decades[decade]
            }
          })

          for (var year = yearStart; year <= yearEnd; year += yearStep) {
            if (decades[year]) {
              var percentage = Math.round(decades[year] / maxCount * 100)
              newDecades.push({
                year: year,
                value: decades[year],
                percentage: percentage
              })
            } else {
              newDecades.push({
                year: year,
                value: 0,
                percentage: 0
              })
            }
          }

          templateData.stats.objects.decades = newDecades
          templateData.stats.objects.decadesDesc = newDecades
            .filter(function (decade) {
              return decade.value > 0
            })
            .map(function (decade) {
              return decade.year + ': ' + decade.value +
                (decade.value === 1 ? ' object' : ' objects')
            })
            .join('; ')
        }
      }

      var html = template(templateData)

      d3.select('#' + id + '-content')
        .html(html)

      d3.select('#' + id + '-last-updated')
        .html(moment(dataPackage.created).fromNow())

      d3.select('#' + id + '-on')
        .style('display', 'table-row')
    })
  })
